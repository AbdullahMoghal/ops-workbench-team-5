package com.warehouse.ops.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class UpdateTicketRequest {
    private UUID locationId;
    private UUID inventoryItemId;
    private UUID categoryId;
    private String ticketType;

    @Size(max = 200)
    private String title;

    private String description;

    @Min(0)
    private Integer quantity;

    @DecimalMin("0.0")
    private BigDecimal estimatedValueImpact;
}
