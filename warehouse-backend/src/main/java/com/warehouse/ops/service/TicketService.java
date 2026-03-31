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
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final AuditLogService auditLogService;

    // Thread-safe sequence for demo ticket numbering
    private static final AtomicInteger ticketSeq = new AtomicInteger(1100);

    @Transactional
    public Ticket create(CreateTicketRequest req, User creator) {
        Location location = locationRepository.findById(req.getLocationId())
            .orElseThrow(() -> new ResourceNotFoundException("Location", req.getLocationId()));

        InventoryItem item = inventoryItemRepository.findById(req.getInventoryItemId())
            .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", req.getInventoryItemId()));

        Category category = req.getCategoryId() != null
            ? categoryRepository.findById(req.getCategoryId()).orElse(null)
            : null;

        Ticket ticket = new Ticket();
        ticket.setTicketNumber("EX-" + ticketSeq.getAndIncrement());
        ticket.setCreatedBy(creator);
        ticket.setLocation(location);
        ticket.setCategory(category);
        ticket.setInventoryItem(item);
        ticket.setTicketType(req.getTicketType());
        ticket.setTitle(req.getTitle());
        ticket.setDescription(req.getDescription());
        ticket.setQuantity(req.getQuantity() != null ? req.getQuantity() : 0);
        ticket.setEstimatedValueImpact(req.getEstimatedValueImpact() != null
            ? req.getEstimatedValueImpact() : BigDecimal.ZERO);
        ticket.setPriority(computePriority(req.getTicketType(), req.getEstimatedValueImpact()));
        ticket.setStatus("new");

        Ticket saved = ticketRepository.save(ticket);
        auditLogService.log(saved, creator, "TICKET_CREATED",
            "Ticket " + saved.getTicketNumber() + " created with priority " + saved.getPriority());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Ticket> getAll(String status, String priority, OffsetDateTime from, OffsetDateTime to) {
        return ticketRepository.findFiltered(status, priority, from, to);
    }

    @Transactional(readOnly = true)
    public Ticket getById(UUID id) {
        return ticketRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket", id));
    }

    @Transactional
    public Ticket update(UUID id, UpdateTicketRequest req, User actor) {
        Ticket ticket = getById(id);
        guardNotClosed(ticket);

        if (req.getLocationId() != null)
            ticket.setLocation(locationRepository.findById(req.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location", req.getLocationId())));
        if (req.getInventoryItemId() != null)
            ticket.setInventoryItem(inventoryItemRepository.findById(req.getInventoryItemId())
                .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", req.getInventoryItemId())));
        if (req.getCategoryId() != null)
            ticket.setCategory(categoryRepository.findById(req.getCategoryId()).orElse(null));
        if (req.getTicketType() != null) ticket.setTicketType(req.getTicketType());
        if (req.getTitle() != null) ticket.setTitle(req.getTitle());
        if (req.getDescription() != null) ticket.setDescription(req.getDescription());
        if (req.getQuantity() != null) ticket.setQuantity(req.getQuantity());
        if (req.getEstimatedValueImpact() != null) ticket.setEstimatedValueImpact(req.getEstimatedValueImpact());

        Ticket saved = ticketRepository.save(ticket);
        auditLogService.log(saved, actor, "TICKET_UPDATED", "Ticket fields updated");
        return saved;
    }

    @Transactional
    public Ticket changeStatus(UUID id, String newStatus, String reason, User actor) {
        Ticket ticket = getById(id);
        guardNotClosed(ticket);

        String oldStatus = ticket.getStatus();
        ticket.setStatus(newStatus);
        Ticket saved = ticketRepository.save(ticket);
        auditLogService.log(saved, actor, "STATUS_CHANGED",
            "Status changed from " + oldStatus + " to " + newStatus +
            (reason != null ? " — " + reason : ""));
        return saved;
    }

    @Transactional
    public Ticket assign(UUID id, UUID userId, User actor) {
        Ticket ticket = getById(id);
        guardNotClosed(ticket);

        User assignee = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        ticket.setAssignedTo(assignee);
        // Auto-advance to in_progress when assigned (if currently new or pending_review)
        if ("new".equals(ticket.getStatus()) || "pending_review".equals(ticket.getStatus())) {
            ticket.setStatus("pending_review");
        }
        Ticket saved = ticketRepository.save(ticket);
        auditLogService.log(saved, actor, "TICKET_ASSIGNED",
            "Assigned to " + assignee.getFullName());
        return saved;
    }

    @Transactional
    public Ticket escalate(UUID id, String reason, User actor) {
        Ticket ticket = getById(id);
        guardNotClosed(ticket);

        ticket.setStatus("escalated");
        Ticket saved = ticketRepository.save(ticket);
        auditLogService.log(saved, actor, "TICKET_ESCALATED",
            "Escalated by " + actor.getFullName() + (reason != null ? ": " + reason : ""));
        return saved;
    }

    @Transactional
    public Ticket close(UUID id, User actor) {
        Ticket ticket = getById(id);
        if ("closed".equals(ticket.getStatus()))
            throw new BusinessRuleException("Ticket " + ticket.getTicketNumber() + " is already closed.");

        ticket.setStatus("closed");
        ticket.setClosedAt(OffsetDateTime.now());
        Ticket saved = ticketRepository.save(ticket);
        auditLogService.log(saved, actor, "TICKET_CLOSED",
            "Ticket closed by " + actor.getFullName());
        return saved;
    }

    /** Auto-suggest priority based on type and value impact. */
    private String computePriority(String ticketType, BigDecimal valueImpact) {
        BigDecimal value = valueImpact != null ? valueImpact : BigDecimal.ZERO;

        // System errors are always critical
        if ("System Error".equals(ticketType)) return "critical";

        // High-value threshold for escalation
        if (value.compareTo(new BigDecimal("1000")) >= 0) return "critical";
        if (value.compareTo(new BigDecimal("500")) >= 0) return "high";

        return switch (ticketType) {
            case "Missing Item", "Expiry Issue" -> "high";
            case "Count Mismatch", "Wrong SKU" -> "medium";
            default -> "low";
        };
    }

    private void guardNotClosed(Ticket ticket) {
        if ("closed".equals(ticket.getStatus())) {
            throw new BusinessRuleException(
                "Ticket " + ticket.getTicketNumber() + " is closed and cannot be modified.");
        }
    }
}
