package com.warehouse.ops.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateLocationRequest {
    @NotBlank(message = "Warehouse is required")
    private String warehouse;

    @NotBlank(message = "Zone is required")
    private String zone;

    @NotBlank(message = "Bin is required")
    private String bin;

    private String status = "active";
}
