package com.ashu.firm.CarRental.Controller;

import com.ashu.firm.CarRental.Repository.UserRepository;
import com.ashu.firm.CarRental.model.User;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        // Check whether email already exists
        if (userRepository.existsByEmail(user.getEmail())) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Email is already registered"
                    ));
        }

        // New users are normal users
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Registration successful",
                        "id",
                        savedUser.getId(),
                        "name",
                        savedUser.getName(),
                        "email",
                        savedUser.getEmail(),
                        "role",
                        savedUser.getRole()
                )
        );
    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {

        User user = userRepository
                .findByEmail(loginUser.getEmail())
                .orElse(null);

        // User not found
        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        // Check password
        if (!user.getPassword().equals(loginUser.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        // Login successful
        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Login successful",
                        "id",
                        user.getId(),
                        "name",
                        user.getName(),
                        "email",
                        user.getEmail(),
                        "role",
                        user.getRole()
                )
        );
    }
}