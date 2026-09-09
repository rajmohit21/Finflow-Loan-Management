package com.finflow.auth.controller;

import com.finflow.auth.dto.UserResponse;
import com.finflow.auth.entity.User;
import com.finflow.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for managing users. 
 * Exposes endpoints for retrieving and updating user details.
 */
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Retrieves a list of all users in the system.
     * 
     * @return List of {@link User} entities.
     */
    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing user's details based on their ID.
     * Currently supports updating the name and role of a user.
     * 
     * @param id The unique identifier of the user to update.
     * @param updatedUser An object containing the new values.
     * @return The updated {@link User} entity.
     * @throws RuntimeException if the user is not found.
     */
    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> optionalUser = userRepository.findById(id);
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Update name if a valid one is provided
            if (updatedUser.getName() != null) user.setName(updatedUser.getName());
            return UserResponse.from(userRepository.save(user));
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
