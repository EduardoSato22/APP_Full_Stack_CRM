package com.retailflow.controller;

import com.retailflow.dto.DashboardSummary;
import com.retailflow.dto.PipelineFunnelStage;
import com.retailflow.dto.RevenueTrendPoint;
import com.retailflow.dto.TopProductPoint;
import com.retailflow.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @Operation(summary = "Resumo do dashboard (KPIs)")
    public ResponseEntity<DashboardSummary> summary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/revenue-trend")
    @Operation(summary = "Tendência de receita — últimos 12 meses")
    public ResponseEntity<List<RevenueTrendPoint>> revenueTrend() {
        return ResponseEntity.ok(dashboardService.getRevenueTrend());
    }

    @GetMapping("/pipeline-funnel")
    @Operation(summary = "Funil de pipeline por estágio")
    public ResponseEntity<List<PipelineFunnelStage>> pipelineFunnel() {
        return ResponseEntity.ok(dashboardService.getPipelineFunnel());
    }

    @GetMapping("/top-products")
    @Operation(summary = "Top 5 produtos em deals ganhos")
    public ResponseEntity<List<TopProductPoint>> topProducts() {
        return ResponseEntity.ok(dashboardService.getTopProducts());
    }
}
