package com.example.backend.service;

import com.example.backend.model.Category;
import com.example.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {
    private final CategoryRepository repository;
    
    @Value("${app.upload.dir}")
    private String uploadDir;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public Category saveCategory(String name, String description, MultipartFile image) throws IOException {
        if (repository.existsByName(name)) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }
        
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        
        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImage(image);
            category.setImageUrl(imageUrl);
        }
        
        return repository.save(category);
    }

    public Category updateCategory(Integer id, String name, String description, MultipartFile image) throws IOException {
        Category existingCategory = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        existingCategory.setName(name);
        existingCategory.setDescription(description);
        
        if (image != null && !image.isEmpty()) {
            // Eliminar la imagen anterior si existe
            if (existingCategory.getImageUrl() != null) {
                deleteImage(existingCategory.getImageUrl());
            }
            
            String newImageUrl = saveImage(image);
            existingCategory.setImageUrl(newImageUrl);
        }
        
        return repository.save(existingCategory);
    }

    public List<Category> getAllCategories() {
        return repository.findAll();
    }
    
    public void deleteCategory(Integer id) throws IOException {
        Category category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        // Eliminar la imagen asociada si existe
        if (category.getImageUrl() != null) {
            deleteImage(category.getImageUrl());
        }
        
        repository.deleteById(id);
    }
    
    public Category getCategoryById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    private String saveImage(MultipartFile image) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(image.getInputStream(), filePath);
        
        return "/uploads/" + filename;
    }
    
    private void deleteImage(String imageUrl) throws IOException {
        try {
            String filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Error al eliminar imagen: " + imageUrl);
            throw e;
        }
    }
}