package com.warehouse.ops.repository;

import com.warehouse.ops.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    @Query("SELECT a FROM AuditLog a LEFT JOIN FETCH a.ticket ORDER BY a.timestamp DESC")
    List<AuditLog> findAllWithTicketOrderByTimestampDesc(Pageable pageable);

    List<AuditLog> findByTicketIdOrderByTimestampDesc(UUID ticketId);

    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);
}
