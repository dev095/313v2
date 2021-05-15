package com.smurov.web.repository;


import com.smurov.web.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findUserById(Long id);

    User findUserByEmail(String email);
}
