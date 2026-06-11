package com.retailflow.service;

import com.retailflow.model.Activity;
import com.retailflow.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.from:noreply@retailflow.dev}")
    private String from;

    @Async
    public void sendWelcome(User user) {
        try {
            Context ctx = new Context(Locale.forLanguageTag("pt-BR"));
            ctx.setVariable("name", user.getName());
            ctx.setVariable("email", user.getEmail());
            String html = templateEngine.process("email/welcome", ctx);
            send(user.getEmail(), "Bem-vindo ao RetailFlow CRM!", html);
        } catch (Exception e) {
            log.warn("Falha ao enviar e-mail de boas-vindas para {}: {}", user.getEmail(), e.getMessage());
        }
    }

    @Async
    public void sendActivityDue(Activity activity, User assignedTo) {
        if (assignedTo == null || assignedTo.getEmail() == null) return;
        try {
            Context ctx = new Context(Locale.forLanguageTag("pt-BR"));
            ctx.setVariable("activityTitle", activity.getTitle());
            ctx.setVariable("dueDate", activity.getDueDate());
            ctx.setVariable("userName", assignedTo.getName());
            String html = templateEngine.process("email/activity-due", ctx);
            send(assignedTo.getEmail(), "Atividade pendente: " + activity.getTitle(), html);
        } catch (Exception e) {
            log.warn("Falha ao enviar e-mail de atividade vencida: {}", e.getMessage());
        }
    }

    private void send(String to, String subject, String html) throws Exception {
        var message = mailSender.createMimeMessage();
        var helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);
        mailSender.send(message);
        log.info("E-mail enviado para {}: {}", to, subject);
    }
}
