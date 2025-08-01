package com.example.backend.controller;

import com.example.backend.model.Category;
import com.example.backend.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {
    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Category createCategory(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image) throws IOException {
        return service.saveCategory(name, description, image);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Category updateCategory(
            @PathVariable Integer id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image) throws IOException {
        return service.updateCategory(id, name, description, image);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return service.getAllCategories();
    }

    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Integer id) {
        return service.getCategoryById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Integer id) throws IOException {
        service.deleteCategory(id);
    }
}