package com.warehouse.ops.repository;

import com.warehouse.ops.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    List<AuditLog> findByTicketIdOrderByTimestampDesc(UUID ticketId);
    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);
}
