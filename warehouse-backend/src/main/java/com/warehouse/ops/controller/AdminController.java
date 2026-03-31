package com.warehouse.ops.controller;

import com.warehouse.ops.dto.request.*;
import com.warehouse.ops.dto.response.*;
import com.warehouse.ops.entity.*;
import com.warehouse.ops.exception.ResourceNotFoundException;
import com.warehouse.ops.mapper.EntityMapper;
import com.warehouse.ops.repository.*;
import com.warehouse.ops.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final LocationRepository locationRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final EntityMapper mapper;

    // --- Users ---
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> listUsers() {
        List<UserResponse> users = userService.getAll()
            .stream().map(mapper::toUserResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody CreateUserRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(mapper.toUserResponse(userService.create(req))));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable UUID id, @Valid @RequestBody CreateUserRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(mapper.toUserResponse(userService.update(id, req))));
    }

    // --- Roles ---
    @GetMapping("/roles")
    public ResponseEntity<ApiResponse<List<Role>>> listRoles() {
        return ResponseEntity.ok(ApiResponse.ok(roleRepository.findAll()));
    }

    // --- Locations ---
    @GetMapping("/locations")
    public ResponseEntity<ApiResponse<List<LocationResponse>>> listLocations() {
        List<LocationResponse> locs = locationRepository.findAll()
            .stream().map(mapper::toLocationResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(locs));
    }

    @PostMapping("/locations")
    public ResponseEntity<ApiResponse<LocationResponse>> createLocation(
            @Valid @RequestBody CreateLocationRequest req) {
        Location l = new Location();
        l.setWarehouse(req.getWarehouse());
        l.setZone(req.getZone());
        l.setBin(req.getBin());
        l.setStatus(req.getStatus() != null ? req.getStatus() : "active");
        Location saved = locationRepository.save(l);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(mapper.toLocationResponse(saved)));
    }

    @PutMapping("/locations/{id}")
    public ResponseEntity<ApiResponse<LocationResponse>> updateLocation(
            @PathVariable UUID id, @Valid @RequestBody CreateLocationRequest req) {
        Location l = locationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Location", id));
        l.setWarehouse(req.getWarehouse());
        l.setZone(req.getZone());
        l.setBin(req.getBin());
        if (req.getStatus() != null) l.setStatus(req.getStatus());
        return ResponseEntity.ok(ApiResponse.ok(mapper.toLocationResponse(locationRepository.save(l))));
    }

    // --- Categories ---
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Category>>> listCategories() {
        return ResponseEntity.ok(ApiResponse.ok(categoryRepository.findAll()));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<Category>> createCategory(
            @Valid @RequestBody CreateCategoryRequest req) {
        Category c = new Category();
        c.setCategoryName(req.getCategoryName());
        c.setDescription(req.getDescription());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(categoryRepository.save(c)));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable UUID id, @Valid @RequestBody CreateCategoryRequest req) {
        Category c = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        c.setCategoryName(req.getCategoryName());
        c.setDescription(req.getDescription());
        return ResponseEntity.ok(ApiResponse.ok(categoryRepository.save(c)));
    }

    // --- Inventory Items ---
    @GetMapping("/inventory-items")
    public ResponseEntity<ApiResponse<List<InventoryItemResponse>>> listItems() {
        List<InventoryItemResponse> items = inventoryItemRepository.findAll()
            .stream().map(mapper::toInventoryItemResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(items));
    }
}
