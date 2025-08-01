package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String firstName, String lastName, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("El email ya está registrado");
        }

        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(password);
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

     public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        
        return user;
    }
/*
        public List<User> getAllUsers() {
        return userRepository.findAll();
    }*/
   /*
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users;
    }*/
       public List<User> getAllUsers() {
        System.out.println("Obteniendo todos los usuarios desde la base de datos");
        List<User> users = userRepository.findAll();
        System.out.println("Número de usuarios recuperados: " + users.size());
        return users;
    }

    public User updateUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (!newRole.equals("USER") && !newRole.equals("ADMIN")) {
            throw new RuntimeException("Rol no válido");
        }
        
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public boolean isAdmin(User user) {
        return user != null && "ADMIN".equals(user.getRole());
    }

    // Añade este método en tu UserService
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

}