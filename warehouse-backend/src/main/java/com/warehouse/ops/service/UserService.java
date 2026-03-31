package com.warehouse.ops.service;

import com.warehouse.ops.dto.request.CreateUserRequest;
import com.warehouse.ops.entity.*;
import com.warehouse.ops.exception.*;
import com.warehouse.ops.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getById(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public User create(CreateUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BusinessRuleException("User with email " + req.getEmail() + " already exists.");
        }
        Role role = roleRepository.findById(req.getRoleId())
            .orElseThrow(() -> new ResourceNotFoundException("Role", req.getRoleId()));

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setRole(role);
        user.setStatus(req.getStatus() != null ? req.getStatus() : "active");
        return userRepository.save(user);
    }

    @Transactional
    public User update(UUID id, CreateUserRequest req) {
        User user = getById(id);
        if (req.getFullName() != null) user.setFullName(req.getFullName());
        if (req.getStatus() != null) user.setStatus(req.getStatus());
        if (req.getRoleId() != null) {
            Role role = roleRepository.findById(req.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role", req.getRoleId()));
            user.setRole(role);
        }
        return userRepository.save(user);
    }
}
