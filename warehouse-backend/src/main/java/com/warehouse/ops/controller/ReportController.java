package com.warehouse.ops.controller;

import com.warehouse.ops.dto.response.*;
import com.warehouse.ops.mapper.EntityMapper;
import com.warehouse.ops.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final TicketService ticketService;
    private final EntityMapper mapper;

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> history(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime to) {
        List<TicketResponse> tickets = ticketService.getAll(status, priority, from, to)
            .stream().map(mapper::toTicketResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(tickets));
    }
}
