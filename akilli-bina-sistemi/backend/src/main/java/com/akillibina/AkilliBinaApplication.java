package com.akillibina;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AkilliBinaApplication {
    public static void main(String[] args) {
        SpringApplication.run(AkilliBinaApplication.class, args);
    }
}
