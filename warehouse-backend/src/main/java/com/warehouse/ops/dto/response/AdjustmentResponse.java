package com.warehouse.ops.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class AdjustmentResponse {
    private UUID id;
    private UUID discrepancyId;
    private UserResponse approvedBy;
    private String decision;
    private String justification;
    private String adjustmentCode;
    private BigDecimal financialImpact;
    private OffsetDateTime approvedAt;
    private OffsetDateTime createdAt;
}
