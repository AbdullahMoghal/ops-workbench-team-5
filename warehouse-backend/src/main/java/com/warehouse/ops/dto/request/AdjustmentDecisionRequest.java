package com.warehouse.ops.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AdjustmentDecisionRequest {
    @NotBlank(message = "Justification is required")
    private String justification;
    private String adjustmentCode;
    private BigDecimal financialImpact;
}
