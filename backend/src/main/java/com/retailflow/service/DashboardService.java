package com.retailflow.service;

import com.retailflow.dto.DashboardSummary;
import com.retailflow.dto.PipelineFunnelStage;
import com.retailflow.dto.RevenueTrendPoint;
import com.retailflow.dto.TopProductPoint;
import com.retailflow.model.Deal;
import com.retailflow.model.User;
import com.retailflow.repository.ActivityRepository;
import com.retailflow.repository.CustomerRepository;
import com.retailflow.repository.DealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final ActivityRepository activityRepository;
    private final UserService userService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return (User) userService.loadUserByUsername(email);
    }

    public String currentUserName() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Cacheable(value = "dashboard-summary", key = "#root.target.currentUserName()")
    public DashboardSummary getSummary() {
        User user = getCurrentUser();
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = todayStart.plusDays(1);

        DashboardSummary summary = new DashboardSummary();
        summary.setTotalCustomers(customerRepository.countByDeletedAtIsNull());
        summary.setNewCustomersThisMonth(customerRepository.countNewSince(monthStart));
        summary.setActiveDeals(dealRepository.countActiveDeals());
        summary.setTotalPipelineValue(dealRepository.sumPipelineValue());
        summary.setWonDealsThisMonth(dealRepository.countWonSince(monthStart));
        summary.setWonRevenueThisMonth(dealRepository.sumWonRevenueBetween(monthStart, todayEnd));
        summary.setActivitiesPendingToday(
                activityRepository.countTodayPending(user.getId(), todayStart, todayEnd));

        long total = dealRepository.count();
        long won = dealRepository.countByStage(Deal.Stage.WON);
        summary.setConversionRate(total > 0 ? (double) won / total * 100 : 0);

        return summary;
    }

    public List<RevenueTrendPoint> getRevenueTrend() {
        List<RevenueTrendPoint> result = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            LocalDate month = LocalDate.now().minusMonths(i);
            String key = month.getYear() + "-" + String.format("%02d", month.getMonthValue());
            LocalDateTime start = month.withDayOfMonth(1).atStartOfDay();
            LocalDateTime end = month.withDayOfMonth(month.lengthOfMonth()).atTime(23, 59, 59);
            result.add(new RevenueTrendPoint(key, dealRepository.sumWonRevenueBetween(start, end)));
        }
        return result;
    }

    public List<PipelineFunnelStage> getPipelineFunnel() {
        Map<String, String> labels = Map.of(
            "PROSPECTING", "Prospecção",
            "QUALIFICATION", "Qualificação",
            "PROPOSAL", "Proposta",
            "NEGOTIATION", "Negociação",
            "WON", "Ganho",
            "LOST", "Perdido"
        );

        Map<String, Object[]> metrics = new LinkedHashMap<>();
        for (Deal.Stage stage : Deal.Stage.values()) {
            metrics.put(stage.name(), new Object[]{0L, BigDecimal.ZERO});
        }
        for (Object[] row : dealRepository.findStageMetrics()) {
            String stage = ((Deal.Stage) row[0]).name();
            metrics.put(stage, new Object[]{row[1], row[2]});
        }

        return metrics.entrySet().stream()
            .map(e -> new PipelineFunnelStage(
                e.getKey(),
                labels.getOrDefault(e.getKey(), e.getKey()),
                ((Number) e.getValue()[0]).longValue(),
                (BigDecimal) e.getValue()[1]))
            .collect(Collectors.toList());
    }

    public List<TopProductPoint> getTopProducts() {
        return dealRepository.findTopProducts(PageRequest.of(0, 5)).stream()
            .map(r -> new TopProductPoint(
                ((Number) r[0]).longValue(),
                (String) r[1],
                ((Number) r[2]).longValue()))
            .collect(Collectors.toList());
    }
}
