package com.warehouse.ops.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateNoteRequest {
    @NotBlank(message = "Note text is required")
    private String noteText;
}
