package com.warehouse.ops.repository;

import com.warehouse.ops.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, UUID> {
    Optional<InventoryItem> findBySku(String sku);
    boolean existsBySku(String sku);

    @Query("SELECT i FROM InventoryItem i WHERE LOWER(i.sku) LIKE LOWER(CONCAT('%',:query,'%')) " +
           "OR LOWER(i.itemName) LIKE LOWER(CONCAT('%',:query,'%'))")
    List<InventoryItem> searchBySkuOrName(String query);
}
