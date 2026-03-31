package com.warehouse.ops.dto.response;

import lombok.Data;
import java.util.UUID;

@Data
public class InventoryItemResponse {
    private UUID id;
    private String sku;
    private String itemName;
    private String categoryName;
}
