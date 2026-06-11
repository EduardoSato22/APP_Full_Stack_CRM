package com.retailflow.controller;

import com.retailflow.service.ExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Exportação")
public class ExportController {

    private final ExportService exportService;

    private static final String today = LocalDate.now().toString();

    // ── Clientes ──────────────────────────────────────────────────────────

    @GetMapping("/customers.csv")
    @Operation(summary = "Exportar clientes (CSV)")
    public ResponseEntity<byte[]> customersCsv() {
        var content = exportService.exportCustomersCsv().getBytes(StandardCharsets.UTF_8);
        return csv(content, "clientes-" + today + ".csv");
    }

    @GetMapping("/customers.xlsx")
    @Operation(summary = "Exportar clientes (Excel)")
    public ResponseEntity<byte[]> customersXlsx() throws IOException {
        return xlsx(exportService.exportCustomersXlsx(), "clientes-" + today + ".xlsx");
    }

    @GetMapping("/customers.pdf")
    @Operation(summary = "Exportar clientes (PDF)")
    public ResponseEntity<byte[]> customersPdf() throws IOException {
        return pdf(exportService.exportCustomersPdf(), "clientes-" + today + ".pdf");
    }

    // ── Negociações ──────────────────────────────────────────────────────

    @GetMapping("/deals.csv")
    @Operation(summary = "Exportar negociações (CSV)")
    public ResponseEntity<byte[]> dealsCsv() {
        var content = exportService.exportDealsCsv().getBytes(StandardCharsets.UTF_8);
        return csv(content, "negociacoes-" + today + ".csv");
    }

    @GetMapping("/deals.xlsx")
    @Operation(summary = "Exportar negociações (Excel)")
    public ResponseEntity<byte[]> dealsXlsx() throws IOException {
        return xlsx(exportService.exportDealsXlsx(), "negociacoes-" + today + ".xlsx");
    }

    @GetMapping("/deals.pdf")
    @Operation(summary = "Exportar negociações (PDF)")
    public ResponseEntity<byte[]> dealsPdf() throws IOException {
        return pdf(exportService.exportDealsPdf(), "negociacoes-" + today + ".pdf");
    }

    // ── Produtos ──────────────────────────────────────────────────────────

    @GetMapping("/products.csv")
    @Operation(summary = "Exportar produtos (CSV)")
    public ResponseEntity<byte[]> productsCsv() {
        var content = exportService.exportProductsCsv().getBytes(StandardCharsets.UTF_8);
        return csv(content, "produtos-" + today + ".csv");
    }

    @GetMapping("/products.xlsx")
    @Operation(summary = "Exportar produtos (Excel)")
    public ResponseEntity<byte[]> productsXlsx() throws IOException {
        return xlsx(exportService.exportProductsXlsx(), "produtos-" + today + ".xlsx");
    }

    @GetMapping("/products.pdf")
    @Operation(summary = "Exportar produtos (PDF)")
    public ResponseEntity<byte[]> productsPdf() throws IOException {
        return pdf(exportService.exportProductsPdf(), "produtos-" + today + ".pdf");
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private ResponseEntity<byte[]> csv(byte[] data, String filename) {
        return ResponseEntity.ok()
                .headers(download(filename))
                .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
                .body(data);
    }

    private ResponseEntity<byte[]> xlsx(byte[] data, String filename) {
        return ResponseEntity.ok()
                .headers(download(filename))
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }

    private ResponseEntity<byte[]> pdf(byte[] data, String filename) {
        return ResponseEntity.ok()
                .headers(download(filename))
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }

    private HttpHeaders download(String filename) {
        var headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
        return headers;
    }
}
