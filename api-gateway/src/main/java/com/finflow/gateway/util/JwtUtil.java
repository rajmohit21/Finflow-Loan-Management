package com.finflow.gateway.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtUtil {

    @Value("${jwt.secret:aVeryLongSecretKeyForJwtValidationWhichMustBeAtLeast256BitsLong}")
    private String secret;

    public void validateToken(final String token) {
        Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token);
    }

    public String extractUserId(String token) {
        return Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody().get("userId").toString();
    }
    public String extractEmail(String token) {
        return Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody().getSubject();
    }

    public String extractRole(String token) {
        Object role = Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody().get("role");
        return role != null ? role.toString() : "";
    }

    private Key getSignKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
