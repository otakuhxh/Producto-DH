package com.example.backend.controller;

import com.example.backend.model.Product;
import com.example.backend.service.ProductService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.io.IOException;
import java.util.List;
import java.util.Map;
//import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(
            @RequestPart Product product,
            @RequestPart(required = false) List<MultipartFile> images) throws IOException {
        return service.saveProduct(product, images);
    }

/*
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product updateProduct(
            @PathVariable Integer id,
            @RequestPart Product product,
            @RequestPart(required = false) List<MultipartFile> images) throws IOException {
        return service.updateProduct(id, product, images);
    }

*/

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product updateProduct(
            @PathVariable Integer id,
            @RequestPart Product product,
            @RequestPart(required = false) List<MultipartFile> images) throws IOException {
        return service.updateProduct(id, product, images);
    }

    @GetMapping
    public List<Product> listProducts() {
        return service.listProducts();
    }

    @GetMapping("/random")
    public List<Product> getRandomProducts() {
        return service.getRandomProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Integer id) {
        return service.getProductById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Integer id) {
        service.deleteProduct(id);
    }

    @DeleteMapping("/images")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteImages(@RequestBody List<String> imageUrls) throws IOException {
        service.deleteImageFiles(imageUrls);
    }

    @DeleteMapping("/by-category/{categoryName}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProductsByCategory(@PathVariable String categoryName) {
        service.deleteProductsByCategory(categoryName);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(required = false) List<String> categories) {
        
        try {
            List<Product> products = service.searchProducts(city, checkIn, checkOut, categories);
            return ResponseEntity.ok(products);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/categories")
    public List<String> getAllCategories() {
        return service.getAllCategories();
    }

    @GetMapping("/count")
    public Map<String, Long> countProductsByCategory(@RequestParam(required = false) String category) {
        return Map.of("count", category != null 
            ? service.countByCategory(category) 
            : service.countAllProducts());
    }
}

/*package com.example.backend.controller;

import com.example.backend.model.Product;
import com.example.backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.DateTimeFormat;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(
            @RequestPart Product product,
            @RequestPart(required = false) List<MultipartFile> images) throws IOException {
        return service.saveProduct(product, images);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product updateProduct(
            @PathVariable Integer id,
            @RequestPart Product product,
            @RequestPart(required = false) List<MultipartFile> images) throws IOException {
        return service.updateProduct(id, product, images);
    }

    @GetMapping
    public List<Product> listProducts() {
        return service.listProducts();
    }

    @GetMapping("/random")
    public List<Product> getRandomProducts() {
        return service.getRandomProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Integer id) {
        return service.getProductById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Integer id) {
        service.deleteProduct(id);
    }

    @DeleteMapping("/images")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteImages(@RequestBody List<String> imageUrls) throws IOException {
        service.deleteImageFiles(imageUrls);
    }
    @DeleteMapping("/by-category/{categoryName}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void deleteProductsByCategory(@PathVariable String categoryName) {
    service.deleteProductsByCategory(categoryName);
}

@GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(required = false) List<String> categories) {
        
        if (checkIn != null && checkOut != null) {
            return productRepository.findAvailableProducts(
                categories != null && !categories.isEmpty() ? categories.get(0) : null,
                city,
                checkIn,
                checkOut
            );
        } else {
            // Búsqueda sin fechas
            if (categories != null && !categories.isEmpty()) {
                return productRepository.findByCategoryIn(categories);
            } else if (city != null) {
                return productRepository.findByCityContainingIgnoreCase(city);
            }
            return productRepository.findAll();
        }
    }

    // Obtener todas las categorías
    @GetMapping("/categories")
    public List<String> getAllCategories() {
        return productRepository.findDistinctCategories();
    }

    // Contar productos por categoría
    @GetMapping("/count")
    public Map<String, Long> countProductsByCategory(@RequestParam(required = false) String category) {
        long count = category != null 
            ? productRepository.countByCategory(category) 
            : productRepository.count();
        return Map.of("count", count);
    }
}*/
/*

package com.example.backend.controller;

import com.example.backend.model.Product;
import com.example.backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")  // <--- Aquí permites CORS solo para tu frontend
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(
            @RequestPart Product product,
            @RequestPart(required = false) List<MultipartFile> images) throws IOException {
        return service.saveProduct(product, images);
    }

    @GetMapping
    public List<Product> listProducts() {
        return service.listProducts();
    }

    @GetMapping("/random")
    public List<Product> getRandomProducts() {
        return service.getRandomProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Integer id) {
        return service.getProductById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Integer id) {
        service.deleteProduct(id);
    }
}*/