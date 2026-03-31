package com.warehouse.ops.dto.response;

import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class UserResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String roleName;
    private UUID roleId;
    private String status;
    private OffsetDateTime createdAt;
}
