package com.smurov.web.service;

import com.smurov.web.model.Role;
import com.smurov.web.model.User;
import com.smurov.web.repository.RoleRepository;
import com.smurov.web.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserServiceImpl(RoleRepository roleRepository, UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public List<User> listUsers() {
        return (List<User>) userRepository.findAll();
    }

    @Transactional
    @Override
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public void add(User user, Long[] rolesId) {
        Set<Role> roles = new HashSet<>();
        for (Long id : rolesId) {
            roles.add(roleRepository.findRoleById(id));
        }
        user.setRoles(roles);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public void remove(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public void update(User user, Long[] rolesId) {
        Set<Role> roles = new HashSet<>();
        User oldUser = userRepository.findUserById(user.getId());
        if (rolesId != null) {
            for (Long id : rolesId) {
                roles.add(roleRepository.findRoleById(id));
            }
        } else {
            roles = (Set<Role>) oldUser.getRoles();
        }
        user.setPassword(oldUser.getPassword());
        user.setRoles(roles);
        userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findUserById(id);
    }

    @Override
    public boolean checkUserById(Long id) {
        return userRepository.findUserById(id) == null;
    }
}

