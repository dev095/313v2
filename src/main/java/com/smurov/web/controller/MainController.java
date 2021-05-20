package com.smurov.web.controller;

import com.smurov.web.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class MainController {

    private final UserService userService;

    public MainController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/main")
    public String getMainAdmin() {
        return "admin";
    }

    @GetMapping("/main/test")
    public String testGet(){
        return "test";
    }

    @GetMapping("/main/demo")
    public String demoGet(){
        return "demo";
    }
}
