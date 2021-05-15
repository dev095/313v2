package com.smurov.web.repository;

import com.smurov.web.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findRoleById(Long id);

    Role findByName(String role);

}
