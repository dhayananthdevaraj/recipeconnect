package com.examly.springapp.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

        private UserDetailsService userService;
         private JwtUtils jwtUtils;

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    // @Override
    // protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
    //         throws IOException, ServletException {
    //     String header = request.getHeader("Authorization");

    //     if (header == null || !header.startsWith("Bearer ")) {
    //         chain.doFilter(request, response);
    //         return;
    //     }

    //     // If the Authorization header is present, try to authenticate the user
    //     SecurityContextHolder.getContext().setAuthentication(getAuthentication(request));

    //     chain.doFilter(request, response);
    // }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        String header = request.getHeader("Authorization");

        if (header == null) {
            chain.doFilter(request, response);
            return;
        }

        // If the Authorization header is present, try to authenticate the user
        SecurityContextHolder.getContext().setAuthentication(getAuthentication(request));

        chain.doFilter(request, response);
    }

    // Implement a method to extract and validate the token
    // For example, you can use JwtUtils.validateToken method

    // Replace this with your actual implementation
    private Authentication getAuthentication(HttpServletRequest request) {
        // Extract and validate the token
        String token = extractToken(request);
        
        if (token != null && JwtUtils.validateToken(token)) {
            // Parse the token and get user information
            UserDetails userDetails = JwtUtils.parseToken(token);

            // Create an authentication object
            return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        }

        return null;
    }

    // Replace this with your actual implementation
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null) {
            if (header.startsWith("Bearer ")) {
                return header.replace("Bearer ", "");
            } else {
                return header;
            }
        }
        return null;
    }
}
