package com.warehouse.ops.controller;

import com.warehouse.ops.dto.request.*;
import com.warehouse.ops.dto.response.*;
import com.warehouse.ops.entity.*;
import com.warehouse.ops.mapper.EntityMapper;
import com.warehouse.ops.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final NoteService noteService;
    private final AuditLogService auditLogService;
    private final EntityMapper mapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketResponse>>> list(
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

    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> create(
            @Valid @RequestBody CreateTicketRequest req,
            @AuthenticationPrincipal User actor) {
        Ticket ticket = ticketService.create(req, actor);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Ticket created successfully", mapper.toTicketResponse(ticket)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(mapper.toTicketResponse(ticketService.getById(id))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTicketRequest req,
            @AuthenticationPrincipal User actor) {
        return ResponseEntity.ok(ApiResponse.ok(mapper.toTicketResponse(ticketService.update(id, req, actor))));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TicketResponse>> changeStatus(
            @PathVariable UUID id,
            @Valid @RequestBody StatusUpdateRequest req,
            @AuthenticationPrincipal User actor) {
        return ResponseEntity.ok(ApiResponse.ok(
            mapper.toTicketResponse(ticketService.changeStatus(id, req.getStatus(), req.getReason(), actor))));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<TicketResponse>> assign(
            @PathVariable UUID id,
            @Valid @RequestBody AssignRequest req,
            @AuthenticationPrincipal User actor) {
        return ResponseEntity.ok(ApiResponse.ok(
            mapper.toTicketResponse(ticketService.assign(id, req.getUserId(), actor))));
    }

    @PatchMapping("/{id}/escalate")
    public ResponseEntity<ApiResponse<TicketResponse>> escalate(
            @PathVariable UUID id,
            @RequestBody(required = false) StatusUpdateRequest req,
            @AuthenticationPrincipal User actor) {
        String reason = req != null ? req.getReason() : null;
        return ResponseEntity.ok(ApiResponse.ok(
            mapper.toTicketResponse(ticketService.escalate(id, reason, actor))));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<ApiResponse<TicketResponse>> close(
            @PathVariable UUID id,
            @AuthenticationPrincipal User actor) {
        return ResponseEntity.ok(ApiResponse.ok(
            mapper.toTicketResponse(ticketService.close(id, actor))));
    }

    // --- Notes sub-resource ---

    @GetMapping("/{id}/notes")
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getNotes(@PathVariable UUID id) {
        List<NoteResponse> notes = noteService.getByTicket(id)
            .stream().map(mapper::toNoteResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(notes));
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<ApiResponse<NoteResponse>> addNote(
            @PathVariable UUID id,
            @Valid @RequestBody CreateNoteRequest req,
            @AuthenticationPrincipal User actor) {
        Note note = noteService.create(id, req, actor);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(mapper.toNoteResponse(note)));
    }

    // --- Audit logs sub-resource ---

    @GetMapping("/{id}/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAuditLogs(@PathVariable UUID id) {
        List<AuditLogResponse> logs = auditLogService.getByTicket(id)
            .stream().map(mapper::toAuditLogResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }
}
