package com.warehouse.ops.dto.response;

import lombok.Data;
import java.util.UUID;

@Data
public class LocationResponse {
    private UUID id;
    private String warehouse;
    private String zone;
    private String bin;
    private String status;
    private String displayLabel;
}
