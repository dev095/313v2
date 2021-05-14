package com.smurov.web.repository;

import com.smurov.web.model.Role;
import org.springframework.data.repository.CrudRepository;

public interface RoleRepository extends CrudRepository<Role, Long> {

    Role findRoleById(Long id);

}
