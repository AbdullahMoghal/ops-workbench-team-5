package com.warehouse.ops.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class TicketResponse {
    private UUID id;
    private String ticketNumber;
    private UserResponse createdBy;
    private UserResponse assignedTo;
    private LocationResponse location;
    private String categoryName;
    private InventoryItemResponse inventoryItem;
    private String ticketType;
    private String status;
    private String priority;
    private Integer quantity;
    private String title;
    private String description;
    private BigDecimal estimatedValueImpact;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private OffsetDateTime closedAt;
}
