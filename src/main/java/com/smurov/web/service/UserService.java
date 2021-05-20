package com.smurov.web.service;

import com.smurov.web.model.User;

import java.util.List;

public interface UserService {

    void add(User user, Long[] rolesId);

    void saveUser(User user);

    List<User> listUsers();

    void remove(Long id);

    User getUserById(Long id);

    User findUserByEmail(String email);
}
