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
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;
    private final UserRepository userRepository;

    @Autowired
    public AdminController(UserService userService,
                           RoleService roleService,
                           UserRepository userRepository) {
        this.userService = userService;
        this.roleService = roleService;
        this.userRepository = userRepository;
    }

    @GetMapping()
    public String getUsers(Model model, Principal principal) {
        model.addAttribute("users", userService.listUsers());
        model.addAttribute("roles", roleService.getRoles());
        model.addAttribute("nowUser", userService.findUserByEmail(principal.getName()));
        model.addAttribute("newUser", new User());
        return "admin";
    }

    @PostMapping(value = "/add")
    public String addUser(@ModelAttribute User user,
                          @RequestParam(value = "roles") Long[] rolesId) {
        userService.add(user, rolesId);
        return "redirect:/admin";
    }

    @PostMapping(value = "/delete/{id}")
    public String deleteUser(@ModelAttribute("id") Long id) throws NotFoundException {

        if (getCurrentUser().getId() != id) {
            userRepository.deleteById(id);
        } else {
            return "login";
        }
        return "redirect:/admin";
    }

    @PostMapping(value = "/update")
    public String updateUser(@ModelAttribute("user") User user,
                             @RequestParam(value = "rolesId", required = false) Long[] rolesId) {
        userService.update(user, rolesId);
        return "redirect:/admin";
    }

    @GetMapping(value = "/update")
    public String updateUser(@ModelAttribute("id") Long id, Model model) {
        if (userService.checkUserById(id)) {
            return "admin";
        }
        User user = userService.getUserById(id);
        model.addAttribute("roles", roleService.getRoles());
        model.addAttribute("user", user);
        return "admin";
    }

    private User getCurrentUser() throws NotFoundException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (null == auth) {
            throw new NotFoundException("");
        }
        Object obj = auth.getPrincipal();
        String email = "";

        if (obj instanceof UserDetails) {
            email = ((UserDetails) obj).getUsername();
        } else {
            email = obj.toString();
        }
        User u = userRepository.findUserByEmail(email);
        return u;
    }

}
