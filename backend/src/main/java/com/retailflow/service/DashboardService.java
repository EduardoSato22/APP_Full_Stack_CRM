package com.retailflow.service;

import com.retailflow.dto.DashboardSummary;
import com.retailflow.model.Deal;
import com.retailflow.model.User;
import com.retailflow.repository.ActivityRepository;
import com.retailflow.repository.CustomerRepository;
import com.retailflow.repository.DealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

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
        summary.setWonRevenueThisMonth(dealRepository.sumWonRevenueSince(monthStart));
        summary.setActivitiesPendingToday(
                activityRepository.countTodayPending(user.getId(), todayStart, todayEnd));

        // Deals by stage
        Map<String, Long> byStage = new LinkedHashMap<>();
        for (Deal.Stage stage : Deal.Stage.values()) byStage.put(stage.name(), 0L);
        dealRepository.findAll().stream()
                .filter(d -> d.getDeletedAt() == null)
                .forEach(d -> byStage.merge(d.getStage().name(), 1L, Long::sum));
        summary.setDealsByStage(byStage);

        // Conversion rate
        long total = byStage.values().stream().mapToLong(Long::longValue).sum();
        long won = byStage.getOrDefault("WON", 0L);
        summary.setConversionRate(total > 0 ? (double) won / total * 100 : 0);

        // Revenue by month (last 6 months)
        Map<String, BigDecimal> revenueByMonth = new LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate month = LocalDate.now().minusMonths(i);
            String key = month.getYear() + "-" + String.format("%02d", month.getMonthValue());
            LocalDateTime start = month.withDayOfMonth(1).atStartOfDay();
            LocalDateTime end = month.withDayOfMonth(month.lengthOfMonth()).atTime(23, 59, 59);
            revenueByMonth.put(key, dealRepository.sumWonRevenueSince(start));
        }
        summary.setRevenueByMonth(revenueByMonth);

        return summary;
    }
}