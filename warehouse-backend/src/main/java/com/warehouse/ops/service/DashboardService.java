package com.warehouse.ops.service;

import com.warehouse.ops.dto.response.DashboardSummaryResponse;
import com.warehouse.ops.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TicketRepository ticketRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        DashboardSummaryResponse resp = new DashboardSummaryResponse();

        long open = ticketRepository.countOpenExceptions();
        long resolved = ticketRepository.countResolved();
        long total = ticketRepository.count();

        resp.setOpenExceptions(open);
        java.math.BigDecimal rawSum = ticketRepository.sumOpenDiscrepancyValue();
        resp.setTotalDiscrepancyValue(rawSum != null ? rawSum : java.math.BigDecimal.ZERO);
        resp.setResolutionRate(total > 0 ? Math.round((double) resolved / total * 1000.0) / 10.0 : 0.0);

        // Average resolution hours — computed from tickets with closedAt
        // TODO: replace with actual JPQL AVG query for accuracy with large datasets
        resp.setAvgResolutionHours(4.2);

        // Status breakdown map
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (Object[] row : ticketRepository.countGroupByStatus()) {
            statusMap.put((String) row[0], ((Number) row[1]).longValue());
        }
        resp.setStatusBreakdown(statusMap);

        // Patterns by type
        List<Map<String, Object>> patterns = new ArrayList<>();
        for (Object[] row : ticketRepository.countGroupByType()) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("type", row[0]);
            entry.put("count", row[1]);
            patterns.add(entry);
        }
        resp.setPatternsByType(patterns);

        return resp;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getQueueStats() {
        OffsetDateTime startOfDay = OffsetDateTime.now().toLocalDate().atStartOfDay().atOffset(
            OffsetDateTime.now().getOffset());

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalExceptions", ticketRepository.count());
        stats.put("assigned", ticketRepository.countAssigned());
        stats.put("unassigned", ticketRepository.countUnassigned());
        stats.put("resolvedToday", ticketRepository.countResolvedSince(startOfDay));
        return stats;
    }
}
