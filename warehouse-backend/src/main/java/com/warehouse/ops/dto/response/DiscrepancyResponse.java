package com.warehouse.ops.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class DiscrepancyResponse {
    private UUID id;
    private UUID ticketId;
    private String ticketNumber;
    private InventoryItemResponse item;
    private Integer expectedQty;
    private Integer actualQty;
    private Integer variance;
    private BigDecimal varianceValue;
    private OffsetDateTime createdAt;
    private AdjustmentResponse adjustment;
}
