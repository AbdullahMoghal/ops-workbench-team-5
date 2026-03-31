package com.warehouse.ops.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "discrepancy_details")
@Getter @Setter @NoArgsConstructor
public class DiscrepancyDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false, unique = true)
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private InventoryItem item;

    @Column(name = "expected_qty", nullable = false)
    private Integer expectedQty;

    @Column(name = "actual_qty", nullable = false)
    private Integer actualQty;

    /** Computed as actual_qty - expected_qty. Persisted for query convenience. */
    @Column
    private Integer variance;

    @Column(name = "variance_value", nullable = false, precision = 12, scale = 2)
    private BigDecimal varianceValue = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
