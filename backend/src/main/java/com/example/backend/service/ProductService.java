package com.example.backend.service;

import com.example.backend.model.Product;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    private final ProductRepository repository;
    
    @Value("${app.upload.dir}")
    private String uploadDir;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public Product saveProduct(Product product, List<MultipartFile> images) throws IOException {
        if (repository.existsByName(product.getName())) {
            throw new RuntimeException("Ya existe un producto con ese nombre");
        }
        
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = saveImages(images);
            product.setImageUrls(imageUrls);
        }
        
        return repository.save(product);
    }

    private List<String> saveImages(List<MultipartFile> images) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        Path uploadPath = Paths.get(uploadDir);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path filePath = uploadPath.resolve(filename);
                Files.copy(image.getInputStream(), filePath);
                imageUrls.add("/uploads/" + filename);
            }
        }
        
        return imageUrls;
    }
    
    // Otros métodos del servicio...
    public List<Product> listProducts() { return repository.findAll(); }
    public List<Product> getRandomProducts() { return repository.findRandomProducts(); }
    public void deleteProduct(Integer id) { repository.deleteById(id); }
    public Product getProductById(Integer id) {
    return repository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
}


}