package com.warehouse.ops.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateDiscrepancyRequest {

    @NotNull(message = "Ticket ID is required")
    private UUID ticketId;

    @NotNull(message = "Item ID is required")
    private UUID itemId;

    @NotNull(message = "Expected quantity is required")
    @Min(0)
    private Integer expectedQty;

    @NotNull(message = "Actual quantity is required")
    @Min(0)
    private Integer actualQty;

    private BigDecimal varianceValue = BigDecimal.ZERO;
}
