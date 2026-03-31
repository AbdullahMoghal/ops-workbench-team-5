package com.warehouse.ops.controller;

import com.warehouse.ops.dto.response.*;
import com.warehouse.ops.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> summary() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getSummary()));
    }

    @GetMapping("/queue-stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> queueStats() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getQueueStats()));
    }
}
