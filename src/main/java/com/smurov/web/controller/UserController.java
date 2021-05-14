package com.smurov.web.controller;

import com.smurov.web.model.User;
import com.smurov.web.repository.UserRepository;
import com.smurov.web.service.RoleService;
import com.smurov.web.service.UserService;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;


@Controller
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final RoleService roleService;
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserService userService,
                          RoleService roleService,
                          UserRepository userRepository) {
        this.userService = userService;
        this.roleService = roleService;
        this.userRepository = userRepository;
    }

    @GetMapping()
    public String getUser(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        model.addAttribute("user", userService.findUserByEmail(authentication.getName()));
        return "user";
    }





}

