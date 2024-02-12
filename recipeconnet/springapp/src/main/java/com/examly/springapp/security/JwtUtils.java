package com.examly.springapp.security;

import java.util.ArrayList;
import java.util.Date;

import javax.annotation.PostConstruct;

import java.util.Base64;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;

// Import your UserService
import com.examly.springapp.service.userService;

@Component
public class JwtUtils {
    private static final String SECRET_KEY = Base64.getEncoder().encodeToString(Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded()); // Replace with a secure secret key
    private static final long EXPIRATION_TIME = 60 * 60 * 1000 ; // 10 days

    private static userService staticUserService; // Add this line


    @Autowired
    private userService userservice; // Add a UserService instance

    @PostConstruct
    public void init() {
        staticUserService = this.userservice;
    }


    public static String generateToken(UserDetails userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_KEY)), SignatureAlgorithm.HS256)
            .compact();
    }

    public static boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(Base64.getDecoder().decode(SECRET_KEY))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Extracting subject from claims
            String email = claims.getSubject();

            // Check if the user with this username still exists and is active
            UserDetails userDetails = staticUserService.loadUserByUsername(email);
            if (userDetails == null || !userDetails.isEnabled()) {
                return false;
            }

            return true;
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e) {
            return false;
        }
    }

    public static UserDetails parseToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(Base64.getDecoder().decode(SECRET_KEY)).build().parseClaimsJws(token).getBody();

        // Extract user details from claims and create a UserDetails object
        String email = claims.getSubject();

        // Retrieve the actual UserDetails from your UserService
        UserDetails userDetails = staticUserService.loadUserByUsername(email);

        return userDetails;
    }
}