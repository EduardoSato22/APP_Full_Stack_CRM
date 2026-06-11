package com.retailflow.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class UploadService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
        "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    private static final long MAX_SIZE = 5 * 1024 * 1024L;

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    public String store(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo vazio");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Tipo não permitido. Envie uma imagem (JPEG, PNG, GIF, WebP).");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("Arquivo muito grande. Máximo: 5 MB.");
        }

        String ext = switch (contentType) {
            case "image/png"  -> ".png";
            case "image/gif"  -> ".gif";
            case "image/webp" -> ".webp";
            default           -> ".jpg";
        };
        String filename = UUID.randomUUID() + ext;

        Path dir = Path.of(uploadDir).toAbsolutePath();
        if (!Files.exists(dir)) Files.createDirectories(dir);

        Files.copy(file.getInputStream(), dir.resolve(filename));
        log.info("Upload salvo: {}", filename);

        return "/uploads/" + filename;
    }
}
