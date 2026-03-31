package com.warehouse.ops.service;

import com.warehouse.ops.entity.*;
import com.warehouse.ops.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLog log(Ticket ticket, User user, String action, String details) {
        AuditLog entry = new AuditLog();
        entry.setTicket(ticket);
        entry.setUser(user);
        entry.setAction(action);
        entry.setDetails(details);
        return auditLogRepository.save(entry);
    }

    public List<AuditLog> getByTicket(UUID ticketId) {
        return auditLogRepository.findByTicketIdOrderByTimestampDesc(ticketId);
    }

    public List<AuditLog> getAll(int page, int size) {
        return auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size)).getContent();
    }
}
