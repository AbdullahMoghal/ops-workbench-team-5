package com.warehouse.ops.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "locations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"warehouse", "zone", "bin"})
})
@Getter @Setter @NoArgsConstructor
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String warehouse;

    @Column(nullable = false)
    private String zone;

    @Column(nullable = false)
    private String bin;

    @Column(nullable = false)
    private String status = "active";

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    /** Convenience display label, e.g. "Zone A-12-04" */
    @Transient
    public String getDisplayLabel() {
        return zone + "-" + bin;
    }
}
