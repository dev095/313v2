package com.smurov.web.service;

import com.smurov.web.model.User;

import java.util.List;

public interface UserService {

    void add(User user, Long[] rolesId);

    List<User> listUsers();

    void remove(Long id);

    void update(User user, Long[] rolesId);

    User getUserById(Long id);

    User findUserByEmail(String email);

    boolean checkUserById(Long id);

}
