package com.warehouse.ops.dto.response;

import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class AuditLogResponse {
    private UUID id;
    private UUID ticketId;
    private String ticketNumber;
    private UserResponse user;
    private String action;
    private String details;
    private OffsetDateTime timestamp;
}
