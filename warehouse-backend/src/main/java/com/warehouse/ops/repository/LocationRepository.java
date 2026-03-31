package com.warehouse.ops.repository;

import com.warehouse.ops.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {
    List<Location> findByStatus(String status);
    List<Location> findByWarehouse(String warehouse);
}
