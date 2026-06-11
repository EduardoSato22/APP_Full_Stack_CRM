package com.retailflow.service;

import com.retailflow.dto.CustomerResponse;
import com.retailflow.dto.DealResponse;
import com.retailflow.dto.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final CustomerService customerService;
    private final DealService dealService;
    private final ProductService productService;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    // ── CSV ──────────────────────────────────────────────────────────────────

    public String exportCustomersCsv() {
        List<CustomerResponse> data = customerService.list(null, null, Pageable.unpaged()).getContent();
        var sw = new StringWriter();
        var pw = new PrintWriter(sw);
        pw.println("ID,Nome,Email,Telefone,Empresa,Status,Receita Total,Criado em");
        for (var c : data) {
            pw.printf("%d,%s,%s,%s,%s,%s,%.2f,%s%n",
                c.getId(), csv(c.getFullName()), csv(c.getEmail()),
                csv(c.getPhone()), csv(c.getCompany()), csv(String.valueOf(c.getStatus())),
                c.getTotalRevenue() != null ? c.getTotalRevenue().doubleValue() : 0.0,
                c.getCreatedAt() != null ? FMT.format(c.getCreatedAt()) : "");
        }
        return sw.toString();
    }

    public String exportDealsCsv() {
        List<DealResponse> data = dealService.list(null, null, Pageable.unpaged()).getContent();
        var sw = new StringWriter();
        var pw = new PrintWriter(sw);
        pw.println("ID,Título,Cliente,Estágio,Valor,Probabilidade,Responsável,Criado em");
        for (var d : data) {
            pw.printf("%d,%s,%s,%s,%.2f,%d,%s,%s%n",
                d.getId(), csv(d.getTitle()), csv(d.getCustomerName()),
                csv(String.valueOf(d.getStage())),
                d.getValue() != null ? d.getValue().doubleValue() : 0.0,
                d.getProbability() != null ? d.getProbability() : 0,
                csv(d.getAssignedToName()),
                d.getCreatedAt() != null ? FMT.format(d.getCreatedAt()) : "");
        }
        return sw.toString();
    }

    public String exportProductsCsv() {
        List<ProductResponse> data = productService.list(null, null, null, Pageable.unpaged()).getContent();
        var sw = new StringWriter();
        var pw = new PrintWriter(sw);
        pw.println("ID,Nome,SKU,Categoria,Preço,Estoque,Status");
        for (var p : data) {
            pw.printf("%d,%s,%s,%s,%.2f,%d,%s%n",
                p.getId(), csv(p.getName()), csv(p.getSku()),
                csv(p.getCategoryName()),
                p.getPrice() != null ? p.getPrice().doubleValue() : 0.0,
                p.getStock() != null ? p.getStock() : 0,
                csv(String.valueOf(p.getStatus())));
        }
        return sw.toString();
    }

    // ── Excel ─────────────────────────────────────────────────────────────

    public byte[] exportCustomersXlsx() throws IOException {
        List<CustomerResponse> data = customerService.list(null, null, Pageable.unpaged()).getContent();
        try (var wb = new XSSFWorkbook(); var baos = new ByteArrayOutputStream()) {
            var sheet = wb.createSheet("Clientes");
            var headerStyle = headerStyle(wb);
            createRow(sheet, 0, headerStyle, "ID", "Nome", "Email", "Telefone", "Empresa", "Status", "Receita Total", "Criado em");
            for (int i = 0; i < data.size(); i++) {
                var c = data.get(i);
                createRow(sheet, i + 1, null,
                    String.valueOf(c.getId()), safe(c.getFullName()), safe(c.getEmail()),
                    safe(c.getPhone()), safe(c.getCompany()), safe(String.valueOf(c.getStatus())),
                    c.getTotalRevenue() != null ? c.getTotalRevenue().toPlainString() : "0",
                    c.getCreatedAt() != null ? FMT.format(c.getCreatedAt()) : "");
            }
            autosize(sheet, 8);
            sheet.setAutoFilter(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, 7));
            wb.write(baos);
            return baos.toByteArray();
        }
    }

    public byte[] exportDealsXlsx() throws IOException {
        List<DealResponse> data = dealService.list(null, null, Pageable.unpaged()).getContent();
        try (var wb = new XSSFWorkbook(); var baos = new ByteArrayOutputStream()) {
            var sheet = wb.createSheet("Negociações");
            var headerStyle = headerStyle(wb);
            createRow(sheet, 0, headerStyle, "ID", "Título", "Cliente", "Estágio", "Valor", "Probabilidade", "Responsável", "Criado em");
            for (int i = 0; i < data.size(); i++) {
                var d = data.get(i);
                createRow(sheet, i + 1, null,
                    String.valueOf(d.getId()), safe(d.getTitle()), safe(d.getCustomerName()),
                    safe(String.valueOf(d.getStage())),
                    d.getValue() != null ? d.getValue().toPlainString() : "0",
                    d.getProbability() != null ? String.valueOf(d.getProbability()) : "0",
                    safe(d.getAssignedToName()),
                    d.getCreatedAt() != null ? FMT.format(d.getCreatedAt()) : "");
            }
            autosize(sheet, 8);
            sheet.setAutoFilter(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, 7));
            wb.write(baos);
            return baos.toByteArray();
        }
    }

    public byte[] exportProductsXlsx() throws IOException {
        List<ProductResponse> data = productService.list(null, null, null, Pageable.unpaged()).getContent();
        try (var wb = new XSSFWorkbook(); var baos = new ByteArrayOutputStream()) {
            var sheet = wb.createSheet("Produtos");
            var headerStyle = headerStyle(wb);
            createRow(sheet, 0, headerStyle, "ID", "Nome", "SKU", "Categoria", "Preço", "Estoque", "Status");
            for (int i = 0; i < data.size(); i++) {
                var p = data.get(i);
                createRow(sheet, i + 1, null,
                    String.valueOf(p.getId()), safe(p.getName()), safe(p.getSku()),
                    safe(p.getCategoryName()),
                    p.getPrice() != null ? p.getPrice().toPlainString() : "0",
                    p.getStock() != null ? String.valueOf(p.getStock()) : "0",
                    safe(String.valueOf(p.getStatus())));
            }
            autosize(sheet, 7);
            sheet.setAutoFilter(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, 6));
            wb.write(baos);
            return baos.toByteArray();
        }
    }

    // ── PDF ───────────────────────────────────────────────────────────────

    public byte[] exportCustomersPdf() throws IOException {
        List<CustomerResponse> data = customerService.list(null, null, Pageable.unpaged()).getContent();
        String[] headers = {"ID", "Nome", "Email", "Empresa", "Status", "Receita"};
        String[][] rows = data.stream().map(c -> new String[]{
            String.valueOf(c.getId()), safe(c.getFullName()), safe(c.getEmail()),
            safe(c.getCompany()), safe(String.valueOf(c.getStatus())),
            c.getTotalRevenue() != null ? "R$ " + c.getTotalRevenue().toPlainString() : "R$ 0"
        }).toArray(String[][]::new);
        return buildPdf("Relatório de Clientes", headers, rows);
    }

    public byte[] exportDealsPdf() throws IOException {
        List<DealResponse> data = dealService.list(null, null, Pageable.unpaged()).getContent();
        String[] headers = {"ID", "Título", "Cliente", "Estágio", "Valor", "Prob.%"};
        String[][] rows = data.stream().map(d -> new String[]{
            String.valueOf(d.getId()), safe(d.getTitle()), safe(d.getCustomerName()),
            safe(String.valueOf(d.getStage())),
            d.getValue() != null ? "R$ " + d.getValue().toPlainString() : "R$ 0",
            d.getProbability() != null ? d.getProbability() + "%" : "0%"
        }).toArray(String[][]::new);
        return buildPdf("Relatório de Negociações", headers, rows);
    }

    public byte[] exportProductsPdf() throws IOException {
        List<ProductResponse> data = productService.list(null, null, null, Pageable.unpaged()).getContent();
        String[] headers = {"ID", "Nome", "SKU", "Categoria", "Preço", "Estoque"};
        String[][] rows = data.stream().map(p -> new String[]{
            String.valueOf(p.getId()), safe(p.getName()), safe(p.getSku()),
            safe(p.getCategoryName()),
            p.getPrice() != null ? "R$ " + p.getPrice().toPlainString() : "R$ 0",
            p.getStock() != null ? String.valueOf(p.getStock()) : "0"
        }).toArray(String[][]::new);
        return buildPdf("Relatório de Produtos", headers, rows);
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private byte[] buildPdf(String title, String[] headers, String[][] rows) throws IOException {
        try (var doc = new PDDocument(); var baos = new ByteArrayOutputStream()) {
            var page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            float margin = 40;
            float yStart = page.getMediaBox().getHeight() - margin;
            float tableWidth = page.getMediaBox().getWidth() - 2 * margin;
            float colWidth = tableWidth / headers.length;
            float rowHeight = 18;
            float fontSize = 9;

            try (var cs = new PDPageContentStream(doc, page)) {
                // Title
                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA_BOLD, 14);
                cs.newLineAtOffset(margin, yStart);
                cs.showText(title);
                cs.endText();

                float y = yStart - 24;

                // Header background
                cs.setNonStrokingColor(0.2f, 0.47f, 0.82f);
                cs.addRect(margin, y - 4, tableWidth, rowHeight);
                cs.fill();

                // Header text
                cs.setNonStrokingColor(1f, 1f, 1f);
                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA_BOLD, fontSize);
                for (int i = 0; i < headers.length; i++) {
                    cs.newLineAtOffset(i == 0 ? margin + 2 : colWidth, 0);
                    cs.showText(truncate(headers[i], 15));
                }
                cs.newLineAtOffset(-(margin + 2 + (headers.length - 1) * colWidth), 0);
                cs.endText();

                y -= rowHeight;

                // Rows
                cs.setFont(PDType1Font.HELVETICA, fontSize);
                for (int r = 0; r < Math.min(rows.length, 45); r++) {
                    if (r % 2 == 0) {
                        cs.setNonStrokingColor(0.95f, 0.96f, 0.99f);
                        cs.addRect(margin, y - 4, tableWidth, rowHeight);
                        cs.fill();
                    }
                    cs.setNonStrokingColor(0.1f, 0.1f, 0.1f);
                    cs.beginText();
                    cs.newLineAtOffset(margin + 2, y);
                    for (int c = 0; c < rows[r].length && c < headers.length; c++) {
                        if (c > 0) cs.newLineAtOffset(colWidth, 0);
                        cs.showText(truncate(rows[r][c], 20));
                    }
                    cs.endText();
                    y -= rowHeight;
                }

                // Footer
                cs.setNonStrokingColor(0.5f, 0.5f, 0.5f);
                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA, 8);
                cs.newLineAtOffset(margin, margin / 2);
                cs.showText("RetailFlow CRM — " + rows.length + " registros exportados");
                cs.endText();
            }

            doc.save(baos);
            return baos.toByteArray();
        }
    }

    private CellStyle headerStyle(Workbook wb) {
        var style = wb.createCellStyle();
        var font = wb.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        return style;
    }

    private void createRow(Sheet sheet, int rowNum, CellStyle style, String... values) {
        var row = sheet.createRow(rowNum);
        for (int i = 0; i < values.length; i++) {
            var cell = row.createCell(i);
            cell.setCellValue(values[i] != null ? values[i] : "");
            if (style != null) cell.setCellStyle(style);
        }
    }

    private void autosize(Sheet sheet, int cols) {
        for (int i = 0; i < cols; i++) sheet.autoSizeColumn(i);
    }

    private String csv(String val) {
        if (val == null) return "";
        if (val.contains(",") || val.contains("\"") || val.contains("\n"))
            return "\"" + val.replace("\"", "\"\"") + "\"";
        return val;
    }

    private String safe(String val) {
        return val != null ? val : "";
    }

    private String truncate(String val, int max) {
        if (val == null) return "";
        return val.length() > max ? val.substring(0, max - 1) + "…" : val;
    }
}
