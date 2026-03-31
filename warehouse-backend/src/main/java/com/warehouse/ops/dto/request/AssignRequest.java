package com.warehouse.ops.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class AssignRequest {
    @NotNull(message = "User ID is required")
    private UUID userId;
}
