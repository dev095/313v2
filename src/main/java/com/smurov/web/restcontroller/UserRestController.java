package com.smurov.web.restcontroller;

import com.smurov.web.model.User;
import com.smurov.web.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/user")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/getUser")
    public ResponseEntity<User> getUser(Principal principal) {
        User user = userService.findUserByEmail(principal.getName());
        return ResponseEntity.ok(user);
    }
}
