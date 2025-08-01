package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Collections; // Importación añadida

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
        @RequestParam String firstName,
        @RequestParam String lastName,
        @RequestParam String email,
        @RequestParam String password
    ) {
        try {
            User user = userService.registerUser(firstName, lastName, email, password);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body("Usuario registrado con ID: " + user.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
        @RequestParam String email,
        @RequestParam String password
    ) {
        try {
            User user = userService.loginUser(email, password);
            var response = new Object() {
                public final String firstName = user.getFirstName();
                public final String lastName = user.getLastName();
                public final String email = user.getEmail();
                public final String initials = 
                    (user.getFirstName().substring(0, 1) + user.getLastName().substring(0, 1)).toUpperCase();
            };
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
/*
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }*/
   @GetMapping("/users")
public ResponseEntity<?> getAllUsers() {
    try {
        System.out.println("Solicitud recibida para obtener todos los usuarios");
        List<User> users = userService.getAllUsers();
        
        if (users.isEmpty()) {
            System.out.println("No se encontraron usuarios en la base de datos");
            return ResponseEntity.noContent().build();
        }
        
        System.out.println("Usuarios encontrados: " + users.size());
        return ResponseEntity.ok(users);
    } catch (Exception e) {
        System.err.println("Error en getAllUsers: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
               .body("Error interno al obtener usuarios");
    }
}

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String newRole) {
        try {
            User updatedUser = userService.updateUserRole(userId, newRole);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/verify-admin")
    public ResponseEntity<?> verifyAdmin(@RequestParam String email) {
        try {
            // Usamos userService en lugar de userRepository directamente
            User user = userService.getUserByEmail(email);
            boolean isAdmin = userService.isAdmin(user);
            
            return ResponseEntity.ok()
                    .body(Collections.singletonMap("isAdmin", isAdmin));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}


/*package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
        @RequestParam String firstName,
        @RequestParam String lastName,
        @RequestParam String email,
        @RequestParam String password
    ) {
        try {
            User user = userService.registerUser(firstName, lastName, email, password);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body("Usuario registrado con ID: " + user.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
    @RequestParam String email,
    @RequestParam String password
    ) {
        try {
            User user = userService.loginUser(email, password);
            // Creamos un objeto simple con los datos necesarios para el frontend
            var response = new Object() {
                public final String firstName = user.getFirstName();
                public final String lastName = user.getLastName();
                public final String email = user.getEmail();
                public final String initials = 
                    (user.getFirstName().substring(0, 1) + user.getLastName().substring(0, 1)).toUpperCase();
            };
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String newRole) {
        try {
            User updatedUser = userService.updateUserRole(userId, newRole);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/verify-admin")
public ResponseEntity<?> verifyAdmin(@RequestParam String email) {
    try {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        boolean isAdmin = userService.isAdmin(user);
        
        return ResponseEntity.ok()
                .body(Collections.singletonMap("isAdmin", isAdmin));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("error", e.getMessage()));
    }
}

}
*/