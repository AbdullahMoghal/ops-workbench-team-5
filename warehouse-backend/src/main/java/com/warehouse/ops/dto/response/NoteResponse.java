package com.warehouse.ops.dto.response;

import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class NoteResponse {
    private UUID id;
    private UUID ticketId;
    private UserResponse user;
    private String noteText;
    private OffsetDateTime createdAt;
}
