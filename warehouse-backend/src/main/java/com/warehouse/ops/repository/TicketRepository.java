package com.warehouse.ops.repository;

import com.warehouse.ops.entity.Ticket;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {

    Optional<Ticket> findByTicketNumber(String ticketNumber);

    List<Ticket> findByStatusOrderByCreatedAtDesc(String status);

    List<Ticket> findByPriorityOrderByCreatedAtDesc(String priority);

    List<Ticket> findByCreatedById(UUID userId);

    List<Ticket> findByAssignedToId(UUID userId);

    List<Ticket> findByAssignedToIsNullOrderByCreatedAtDesc();

    List<Ticket> findAllByOrderByCreatedAtDesc();

    @Query("SELECT t FROM Ticket t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:from IS NULL OR t.createdAt >= :from) AND " +
           "(:to IS NULL OR t.createdAt <= :to) " +
           "ORDER BY t.createdAt DESC")
    List<Ticket> findFiltered(
        @Param("status") String status,
        @Param("priority") String priority,
        @Param("from") OffsetDateTime from,
        @Param("to") OffsetDateTime to
    );

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status NOT IN ('resolved','closed','rejected')")
    long countOpenExceptions();

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'resolved' OR t.status = 'closed'")
    long countResolved();

    @Query("SELECT t.status, COUNT(t) FROM Ticket t GROUP BY t.status")
    List<Object[]> countGroupByStatus();

    @Query("SELECT t.ticketType, COUNT(t) FROM Ticket t GROUP BY t.ticketType ORDER BY COUNT(t) DESC")
    List<Object[]> countGroupByType();

    @Query("SELECT SUM(t.estimatedValueImpact) FROM Ticket t WHERE t.status NOT IN ('resolved','closed')")
    java.math.BigDecimal sumOpenDiscrepancyValue();

    /** Count for today resolved (for KPI card) */
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'resolved' AND t.updatedAt >= :since")
    long countResolvedSince(@Param("since") OffsetDateTime since);

    @Query(value = "SELECT COUNT(*) FROM tickets WHERE assigned_to_user_id IS NOT NULL AND status NOT IN ('resolved','closed','rejected')", nativeQuery = true)
    long countAssigned();

    @Query(value = "SELECT COUNT(*) FROM tickets WHERE assigned_to_user_id IS NULL AND status NOT IN ('resolved','closed','rejected')", nativeQuery = true)
    long countUnassigned();
}
