package com.warehouse.ops.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateTicketRequest {

    @NotNull(message = "Location is required")
    private UUID locationId;

    @NotNull(message = "Inventory item is required")
    private UUID inventoryItemId;

    private UUID categoryId;

    @NotBlank(message = "Ticket type is required")
    private String ticketType;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be 200 characters or fewer")
    private String title;

    private String description;

    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity = 0;

    @DecimalMin(value = "0.0", message = "Estimated value impact cannot be negative")
    private BigDecimal estimatedValueImpact = BigDecimal.ZERO;
}
