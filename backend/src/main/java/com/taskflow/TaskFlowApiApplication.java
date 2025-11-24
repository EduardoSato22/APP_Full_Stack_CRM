package com.taskflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv; // Importe isso

@SpringBootApplication
public class TaskFlowApiApplication {

    public static void main(String[] args) {
        
        // Adicione este bloco ANTES do SpringApplication.run
        // Ele carrega o .env e joga as variáveis para o sistema (System Properties)
        Dotenv dotenv = Dotenv.configure().load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(TaskFlowApiApplication.class, args);
    }
}