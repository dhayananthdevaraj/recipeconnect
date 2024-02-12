package com.examly.springapp.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.examly.springapp.model.user;
import com.examly.springapp.security.CustomUserDetails;
import com.examly.springapp.security.JwtUtils;
import com.examly.springapp.service.userService;

@Controller
@RequestMapping("/api/auth")
public class userController {

    @Autowired
    public userService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;



  
 @PostMapping("/login")
    public ResponseEntity<Object> getUserByUsernameAndPassword(@RequestBody user user) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );

            // If authentication is successful, generate JWT
            CustomUserDetails authenticatedUser = (CustomUserDetails) authentication.getPrincipal();
            String token = jwtUtils.generateToken(authenticatedUser);

            // Build the response
            Map<String, Object> response = new HashMap<>();
            response.put("userId", authenticatedUser.getUser().getUserId()); // Assuming email as the userId
            response.put("email", authenticatedUser.getUsername());
            // response.put("password", ""); // Don't send the password in response
            response.put("token", token);
            response.put("role", authenticatedUser.getUser().getRole()); // Adjust as per your user roles

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid Credentials");
            // response.put("exception", e.getMessage());
            // response.put("stackTrace", Arrays.toString(e.getStackTrace()));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }


    // @PostMapping("/login")
    // public ResponseEntity<Object> getUserByUsernameAndPassword(@RequestBody user user) {
    //     try {
    //         user dbUser = userService.getUserByEmailAndPassword(user.getEmail(), user.getPassword());
    //         if (dbUser == null) {
    //             Map<String, String> response = new HashMap<>();
    //             response.put("error", "Invalid Credentials");
    //             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    //         }
    //         return ResponseEntity.ok(dbUser);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    //     }
    // }

    

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> addUser(@RequestBody user user) {
        try {
            userService.addUser(user);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


       
}
