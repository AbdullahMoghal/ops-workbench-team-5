package com.warehouse.ops.controller;

import com.warehouse.ops.dto.request.*;
import com.warehouse.ops.dto.response.*;
import com.warehouse.ops.entity.*;
import com.warehouse.ops.mapper.EntityMapper;
import com.warehouse.ops.service.DiscrepancyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class DiscrepancyController {

    private final DiscrepancyService discrepancyService;
    private final EntityMapper mapper;

    @PostMapping("/api/discrepancies")
    public ResponseEntity<ApiResponse<DiscrepancyResponse>> create(
            @Valid @RequestBody CreateDiscrepancyRequest req,
            @AuthenticationPrincipal User actor) {
        DiscrepancyDetail d = discrepancyService.create(req, actor);
        InventoryAdjustment adj = discrepancyService.getAdjustmentByDiscrepancy(d.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(mapper.toDiscrepancyResponse(d, adj)));
    }

    @GetMapping("/api/discrepancies/{id}")
    public ResponseEntity<ApiResponse<DiscrepancyResponse>> getById(@PathVariable UUID id) {
        DiscrepancyDetail d = discrepancyService.getById(id);
        InventoryAdjustment adj = discrepancyService.getAdjustmentByDiscrepancy(id);
        return ResponseEntity.ok(ApiResponse.ok(mapper.toDiscrepancyResponse(d, adj)));
    }

    @PostMapping("/api/adjustments/{discrepancyId}/approve")
    public ResponseEntity<ApiResponse<AdjustmentResponse>> approve(
            @PathVariable UUID discrepancyId,
            @Valid @RequestBody AdjustmentDecisionRequest req,
            @AuthenticationPrincipal User actor) {
        InventoryAdjustment adj = discrepancyService.approve(discrepancyId, req, actor);
        return ResponseEntity.ok(ApiResponse.ok("Adjustment approved", mapper.toAdjustmentResponse(adj)));
    }

    @PostMapping("/api/adjustments/{discrepancyId}/reject")
    public ResponseEntity<ApiResponse<AdjustmentResponse>> reject(
            @PathVariable UUID discrepancyId,
            @Valid @RequestBody AdjustmentDecisionRequest req,
            @AuthenticationPrincipal User actor) {
        InventoryAdjustment adj = discrepancyService.reject(discrepancyId, req, actor);
        return ResponseEntity.ok(ApiResponse.ok("Adjustment rejected", mapper.toAdjustmentResponse(adj)));
    }
}
