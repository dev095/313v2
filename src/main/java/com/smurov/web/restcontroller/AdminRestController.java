package com.smurov.web.restcontroller;

import com.smurov.web.model.Role;
import com.smurov.web.model.User;
import com.smurov.web.service.RoleService;
import com.smurov.web.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminRestController {

    private final UserService userService;
    private final RoleService roleService;

    public AdminRestController(UserService userService,
                               RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    //all users
    @GetMapping("/list")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> allUser = userService.listUsers();
        return ResponseEntity.ok(allUser);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> allRole = roleService.getRoles();
        return ResponseEntity.ok(allRole);
    }

    //add one user
    @PostMapping("/add")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    //find user by id
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserToEdit(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    //edit user
    @PutMapping("/edit/{id}")
    public ResponseEntity<User> editUser(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    //remove user
    @PostMapping("/delete")
    public ResponseEntity<User> deleteUser(@RequestBody User user) {
        userService.remove(user.getId());
        return ResponseEntity.ok().build();
    }

}
