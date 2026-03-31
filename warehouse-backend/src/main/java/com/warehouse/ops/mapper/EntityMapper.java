package com.warehouse.ops.mapper;

import com.warehouse.ops.dto.response.*;
import com.warehouse.ops.entity.*;
import org.springframework.stereotype.Component;

/** Converts JPA entities to response DTOs. Kept simple and explicit for clarity. */
@Component
public class EntityMapper {

    public UserResponse toUserResponse(User u) {
        if (u == null) return null;
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setFullName(u.getFullName());
        r.setEmail(u.getEmail());
        r.setRoleId(u.getRole() != null ? u.getRole().getId() : null);
        r.setRoleName(u.getRole() != null ? u.getRole().getName() : null);
        r.setStatus(u.getStatus());
        r.setCreatedAt(u.getCreatedAt());
        return r;
    }

    public LocationResponse toLocationResponse(Location l) {
        if (l == null) return null;
        LocationResponse r = new LocationResponse();
        r.setId(l.getId());
        r.setWarehouse(l.getWarehouse());
        r.setZone(l.getZone());
        r.setBin(l.getBin());
        r.setStatus(l.getStatus());
        r.setDisplayLabel(l.getZone() + "-" + l.getBin());
        return r;
    }

    public InventoryItemResponse toInventoryItemResponse(InventoryItem i) {
        if (i == null) return null;
        InventoryItemResponse r = new InventoryItemResponse();
        r.setId(i.getId());
        r.setSku(i.getSku());
        r.setItemName(i.getItemName());
        r.setCategoryName(i.getCategory() != null ? i.getCategory().getCategoryName() : null);
        return r;
    }

    public TicketResponse toTicketResponse(Ticket t) {
        if (t == null) return null;
        TicketResponse r = new TicketResponse();
        r.setId(t.getId());
        r.setTicketNumber(t.getTicketNumber());
        r.setCreatedBy(toUserResponse(t.getCreatedBy()));
        r.setAssignedTo(toUserResponse(t.getAssignedTo()));
        r.setLocation(toLocationResponse(t.getLocation()));
        r.setCategoryName(t.getCategory() != null ? t.getCategory().getCategoryName() : null);
        r.setInventoryItem(toInventoryItemResponse(t.getInventoryItem()));
        r.setTicketType(t.getTicketType());
        r.setStatus(t.getStatus());
        r.setPriority(t.getPriority());
        r.setQuantity(t.getQuantity());
        r.setTitle(t.getTitle());
        r.setDescription(t.getDescription());
        r.setEstimatedValueImpact(t.getEstimatedValueImpact());
        r.setCreatedAt(t.getCreatedAt());
        r.setUpdatedAt(t.getUpdatedAt());
        r.setClosedAt(t.getClosedAt());
        return r;
    }

    public NoteResponse toNoteResponse(Note n) {
        if (n == null) return null;
        NoteResponse r = new NoteResponse();
        r.setId(n.getId());
        r.setTicketId(n.getTicket() != null ? n.getTicket().getId() : null);
        r.setUser(toUserResponse(n.getUser()));
        r.setNoteText(n.getNoteText());
        r.setCreatedAt(n.getCreatedAt());
        return r;
    }

    public AuditLogResponse toAuditLogResponse(AuditLog a) {
        if (a == null) return null;
        AuditLogResponse r = new AuditLogResponse();
        r.setId(a.getId());
        r.setTicketId(a.getTicket() != null ? a.getTicket().getId() : null);
        r.setTicketNumber(a.getTicket() != null ? a.getTicket().getTicketNumber() : null);
        r.setUser(toUserResponse(a.getUser()));
        r.setAction(a.getAction());
        r.setDetails(a.getDetails());
        r.setTimestamp(a.getTimestamp());
        return r;
    }

    public AdjustmentResponse toAdjustmentResponse(InventoryAdjustment adj) {
        if (adj == null) return null;
        AdjustmentResponse r = new AdjustmentResponse();
        r.setId(adj.getId());
        r.setDiscrepancyId(adj.getDiscrepancy() != null ? adj.getDiscrepancy().getId() : null);
        r.setApprovedBy(toUserResponse(adj.getApprovedBy()));
        r.setDecision(adj.getDecision());
        r.setJustification(adj.getJustification());
        r.setAdjustmentCode(adj.getAdjustmentCode());
        r.setFinancialImpact(adj.getFinancialImpact());
        r.setApprovedAt(adj.getApprovedAt());
        r.setCreatedAt(adj.getCreatedAt());
        return r;
    }

    public DiscrepancyResponse toDiscrepancyResponse(DiscrepancyDetail d, InventoryAdjustment adj) {
        if (d == null) return null;
        DiscrepancyResponse r = new DiscrepancyResponse();
        r.setId(d.getId());
        r.setTicketId(d.getTicket() != null ? d.getTicket().getId() : null);
        r.setTicketNumber(d.getTicket() != null ? d.getTicket().getTicketNumber() : null);
        r.setItem(toInventoryItemResponse(d.getItem()));
        r.setExpectedQty(d.getExpectedQty());
        r.setActualQty(d.getActualQty());
        r.setVariance(d.getVariance());
        r.setVarianceValue(d.getVarianceValue());
        r.setCreatedAt(d.getCreatedAt());
        r.setAdjustment(toAdjustmentResponse(adj));
        return r;
    }
}
