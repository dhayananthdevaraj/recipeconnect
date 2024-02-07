package com.examly.springapp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.user;
import com.examly.springapp.repository.userRepo;
import com.examly.springapp.security.CustomUserDetails;

@Service
public class userService implements UserDetailsService {

    @Autowired
    public userRepo userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public user getUserById(Long user_id) {
        return userRepository.findById(user_id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public user getUserByEmailAndPassword(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    public void addUser(user User) {
        User.setPassword(passwordEncoder.encode(User.getPassword()));
        userRepository.save(User);
    }

    public List<user> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Fetch the user from the database
        user User = userRepository.findByEmail(email);
        
        // If the user doesn't exist, throw an exception
        if (User == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    
        // Return the user object directly
        // return User;
        return new CustomUserDetails(User);
    }
}
