/*package com.example.backend.controller;

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

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Integer id) {
        service.deleteProduct(id);
    }
}*/

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
}