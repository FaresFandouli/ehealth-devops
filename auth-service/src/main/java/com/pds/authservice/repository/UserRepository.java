package com.pds.authservice.repository;

import com.pds.authservice.entity.Speciality;
import com.pds.authservice.entity.User;
import com.pds.authservice.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    List<User> findByRoleAndSpeciality(UserRole role, Speciality speciality);
    List<User> findByRole(UserRole role);
}
