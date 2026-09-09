package com.finflow.admin.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Configuration class for initializing a load-balanced RestTemplate.
 * Includes interceptors to propagate authorization headers across microservices.
 */
@Configuration
public class RestTemplateConfig {

    /**
     * Creates a {@link RestTemplate} bean equipped with load balancing.
     * Injects an interceptor to automatically forward JWT tokens to downstream services.
     * 
     * @return Configured RestTemplate instance.
     */
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(org.springframework.boot.web.client.RestTemplateBuilder builder) {
        return builder
                .additionalInterceptors((request, body, execution) -> {
                    ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                    if (attributes != null) {
                        String authHeader = attributes.getRequest().getHeader("Authorization");
                        if (authHeader != null) {
                            request.getHeaders().add("Authorization", authHeader);
                        }
                    }
                    return execution.execute(request, body);
                })
                .build();
    }
}
