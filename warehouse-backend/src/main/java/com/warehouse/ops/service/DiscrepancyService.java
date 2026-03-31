package com.warehouse.ops.service;

import com.warehouse.ops.dto.request.*;
import com.warehouse.ops.entity.*;
import com.warehouse.ops.exception.*;
import com.warehouse.ops.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DiscrepancyService {

    private final DiscrepancyDetailRepository discrepancyRepo;
    private final InventoryAdjustmentRepository adjustmentRepo;
    private final TicketRepository ticketRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public DiscrepancyDetail create(CreateDiscrepancyRequest req, User actor) {
        if (discrepancyRepo.existsByTicketId(req.getTicketId())) {
            throw new BusinessRuleException("A discrepancy already exists for this ticket.");
        }

        Ticket ticket = ticketRepository.findById(req.getTicketId())
            .orElseThrow(() -> new ResourceNotFoundException("Ticket", req.getTicketId()));

        if ("closed".equals(ticket.getStatus()))
            throw new BusinessRuleException("Cannot add discrepancy to a closed ticket.");

        InventoryItem item = inventoryItemRepository.findById(req.getItemId())
            .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", req.getItemId()));

        DiscrepancyDetail d = new DiscrepancyDetail();
        d.setTicket(ticket);
        d.setItem(item);
        d.setExpectedQty(req.getExpectedQty());
        d.setActualQty(req.getActualQty());
        d.setVariance(req.getActualQty() - req.getExpectedQty());
        d.setVarianceValue(req.getVarianceValue() != null ? req.getVarianceValue() : BigDecimal.ZERO);

        DiscrepancyDetail saved = discrepancyRepo.save(d);
        auditLogService.log(ticket, actor, "DISCREPANCY_LOGGED",
            "Discrepancy: expected " + req.getExpectedQty() + " actual " + req.getActualQty());
        return saved;
    }

    @Transactional(readOnly = true)
    public DiscrepancyDetail getById(UUID id) {
        return discrepancyRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("DiscrepancyDetail", id));
    }

    @Transactional(readOnly = true)
    public DiscrepancyDetail getByTicket(UUID ticketId) {
        return discrepancyRepo.findByTicketId(ticketId)
            .orElseThrow(() -> new ResourceNotFoundException("DiscrepancyDetail for ticket", ticketId));
    }

    @Transactional
    public InventoryAdjustment approve(UUID discrepancyId, AdjustmentDecisionRequest req, User actor) {
        return processDecision(discrepancyId, "approved", req, actor);
    }

    @Transactional
    public InventoryAdjustment reject(UUID discrepancyId, AdjustmentDecisionRequest req, User actor) {
        return processDecision(discrepancyId, "rejected", req, actor);
    }

    private InventoryAdjustment processDecision(UUID discrepancyId, String decision,
                                                 AdjustmentDecisionRequest req, User actor) {
        // Business rule: only Supervisor or OpsManager may approve/reject
        String roleName = actor.getRole().getName();
        if (!"Supervisor".equals(roleName) && !"OpsManager".equals(roleName) && !"Admin".equals(roleName)) {
            throw new BusinessRuleException("Only Supervisors or OpsManagers can " + decision + " adjustments.");
        }

        DiscrepancyDetail discrepancy = getById(discrepancyId);

        InventoryAdjustment adj;
        if (adjustmentRepo.existsByDiscrepancyId(discrepancyId)) {
            adj = adjustmentRepo.findByDiscrepancyId(discrepancyId).get();
            if (adj.getDecision() != null) {
                throw new BusinessRuleException("Adjustment has already been decided: " + adj.getDecision());
            }
        } else {
            adj = new InventoryAdjustment();
            adj.setDiscrepancy(discrepancy);
        }

        adj.setApprovedBy(actor);
        adj.setDecision(decision);
        adj.setJustification(req.getJustification());
        adj.setAdjustmentCode(req.getAdjustmentCode());
        adj.setFinancialImpact(req.getFinancialImpact() != null ? req.getFinancialImpact() : BigDecimal.ZERO);
        adj.setApprovedAt(OffsetDateTime.now());

        InventoryAdjustment saved = adjustmentRepo.save(adj);

        // Update ticket status based on decision
        Ticket ticket = discrepancy.getTicket();
        ticket.setStatus("approved".equals(decision) ? "resolved" : "rejected");
        ticketRepository.save(ticket);

        auditLogService.log(ticket, actor, "ADJUSTMENT_" + decision.toUpperCase(),
            "Adjustment " + decision + " by " + actor.getFullName() +
            ". Impact: " + adj.getFinancialImpact() + ". " + req.getJustification());

        return saved;
    }

    @Transactional(readOnly = true)
    public InventoryAdjustment getAdjustmentByDiscrepancy(UUID discrepancyId) {
        return adjustmentRepo.findByDiscrepancyId(discrepancyId).orElse(null);
    }
}
