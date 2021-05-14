package com.smurov.web.repository;


import com.smurov.web.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {

    User findUserById(Long id);

    User findUserByEmail(String email);
}
