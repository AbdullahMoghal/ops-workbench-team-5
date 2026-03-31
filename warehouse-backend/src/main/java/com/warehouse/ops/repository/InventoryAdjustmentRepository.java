package com.warehouse.ops.repository;

import com.warehouse.ops.entity.InventoryAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface InventoryAdjustmentRepository extends JpaRepository<InventoryAdjustment, UUID> {
    Optional<InventoryAdjustment> findByDiscrepancyId(UUID discrepancyId);
    boolean existsByDiscrepancyId(UUID discrepancyId);
}
