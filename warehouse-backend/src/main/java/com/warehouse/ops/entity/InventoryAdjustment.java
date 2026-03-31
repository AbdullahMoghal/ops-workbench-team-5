package com.warehouse.ops.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "inventory_adjustments")
@Getter @Setter @NoArgsConstructor
public class InventoryAdjustment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discrepancy_id", nullable = false, unique = true)
    private DiscrepancyDetail discrepancy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "approved_by_user_id")
    private User approvedBy;

    /** 'approved' or 'rejected' */
    private String decision;

    @Column(columnDefinition = "TEXT")
    private String justification;

    @Column(name = "adjustment_code")
    private String adjustmentCode;

    @Column(name = "financial_impact", precision = 12, scale = 2)
    private BigDecimal financialImpact = BigDecimal.ZERO;

    @Column(name = "approved_at")
    private OffsetDateTime approvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
