package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.user;


@Repository
public interface userRepo extends JpaRepository<user, Long>{
    user findByEmailAndPassword(String email, String password);

    user findByEmail(String email);
}
