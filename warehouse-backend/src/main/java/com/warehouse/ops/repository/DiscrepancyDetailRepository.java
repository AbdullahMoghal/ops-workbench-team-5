package com.warehouse.ops.repository;

import com.warehouse.ops.entity.DiscrepancyDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface DiscrepancyDetailRepository extends JpaRepository<DiscrepancyDetail, UUID> {
    Optional<DiscrepancyDetail> findByTicketId(UUID ticketId);
    boolean existsByTicketId(UUID ticketId);
}
