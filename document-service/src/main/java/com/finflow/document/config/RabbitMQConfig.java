package com.finflow.document.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "finflow.exchange";
    public static final String ROUTING_KEY_UPLOAD = "document.uploaded";
    public static final String ROUTING_KEY_VERIFY = "document.verified";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }
}
