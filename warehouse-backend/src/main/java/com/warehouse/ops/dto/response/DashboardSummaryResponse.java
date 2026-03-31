package com.warehouse.ops.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class DashboardSummaryResponse {
    private long openExceptions;
    private double avgResolutionHours;
    private BigDecimal totalDiscrepancyValue;
    private double resolutionRate;
    private Map<String, Long> statusBreakdown;
    private List<Map<String, Object>> patternsByType;
}
