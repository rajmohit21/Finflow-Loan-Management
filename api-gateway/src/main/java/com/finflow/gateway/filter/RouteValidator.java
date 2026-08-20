package com.finflow.gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

/**
 * Component responsible for validating API Gateway routes.
 * Defines which endpoints are public and which require authentication.
 */
@Component
public class RouteValidator {

    /**
     * List of endpoints that are explicitly openly accessible without a JWT token.
     * This primarily includes authentication and documentation routes.
     */
    public static final List<String> openApiEndpoints = List.of(
            "/gateway/auth/signup",
            "/gateway/auth/login",
            "/gateway/auth/validate",
            "/eureka",
            "/v3/api-docs",
            "/swagger-ui",
            "/swagger-resources",
            "/webjars",
            "/favicon.ico",
            "/"
    );

    /**
     * Predicate defining whether an incoming request requires security checks.
     * Returns true if the requested URI does NOT match any of the open API endpoints.
     */
    public Predicate<ServerHttpRequest> isSecured =
            request -> {
                String path = request.getURI().getPath();
                if (path.contains("/v3/api-docs") || path.contains("/swagger-ui") || path.contains("/swagger-resources") || path.contains("/webjars")) {
                    return false;
                }
                return openApiEndpoints.stream()
                        .noneMatch(uri -> path.equalsIgnoreCase(uri) || 
                                         (path.startsWith(uri) && !uri.equals("/")));
            };
}
