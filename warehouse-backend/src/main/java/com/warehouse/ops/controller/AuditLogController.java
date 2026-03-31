package com.warehouse.ops.controller;

import com.warehouse.ops.dto.response.*;
import com.warehouse.ops.mapper.EntityMapper;
import com.warehouse.ops.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;
    private final EntityMapper mapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        List<AuditLogResponse> logs = auditLogService.getAll(page, size)
            .stream().map(mapper::toAuditLogResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }
}
