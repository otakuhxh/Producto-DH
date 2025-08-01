package com.example.backend.service;

import com.example.backend.model.Product;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
//import com.example.backend.model.Feature;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Map;
//import java.util.stream.Collectors;

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

/*
   public Product updateProduct(Integer id, Product product, List<MultipartFile> images) throws IOException {
        Product existingProduct = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setCity(product.getCity());
        existingProduct.setRating(product.getRating());
        
        if (product.getImageUrls() != null) {
            existingProduct.setImageUrls(product.getImageUrls());
        }

        if (images != null && !images.isEmpty()) {
            List<String> newImageUrls = saveImages(images);
            existingProduct.getImageUrls().addAll(newImageUrls);
        }

        return repository.save(existingProduct);
    }

*/

   public Product updateProduct(Integer id, Product product, List<MultipartFile> images) throws IOException {
        Product existingProduct = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setCity(product.getCity());
        existingProduct.setRating(product.getRating());
        existingProduct.setFeatures(product.getFeatures());


        if (product.getImageUrls() != null) {
            existingProduct.setImageUrls(product.getImageUrls());
        }

        if (images != null && !images.isEmpty()) {
            List<String> newImageUrls = saveImages(images);
            existingProduct.getImageUrls().addAll(newImageUrls);
        }

        return repository.save(existingProduct);
    }


    public void deleteImageFiles(List<String> imageUrls) throws IOException {
        for (String imageUrl : imageUrls) {
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
    
    public List<Product> listProducts() { 
        return repository.findAll(); 
    }
    
    public List<Product> getRandomProducts() { 
        return repository.findRandomProducts(); 
    }
    
    public void deleteProduct(Integer id) { 
        repository.deleteById(id); 
    }
    
    public Product getProductById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
    
    public void deleteProductsByCategory(String categoryName) {
        List<Product> products = repository.findByCategory(categoryName);
        
        products.forEach(product -> {
            if (product.getImageUrls() != null && !product.getImageUrls().isEmpty()) {
                try {
                    deleteImageFiles(product.getImageUrls());
                } catch (IOException e) {
                    System.err.println("Error al eliminar imágenes del producto " + product.getId());
                }
            }
        });
        
        repository.deleteByCategory(categoryName);
    }

    public List<Product> searchProducts(String city, LocalDate checkIn, LocalDate checkOut, List<String> categories) {
        if (checkIn != null && checkOut != null) {
            if (checkOut.isBefore(checkIn)) {
                throw new IllegalArgumentException("La fecha de salida debe ser después de la fecha de entrada");
            }
            return repository.findAvailableProducts(
                categories,
                city,
                checkIn,
                checkOut
            );
        }
        
        if (categories != null && !categories.isEmpty()) {
            if (city != null) {
                return repository.findByCategoryIn(categories).stream()
                    .filter(p -> p.getCity().toLowerCase().contains(city.toLowerCase()))
                    .toList();
            }
            return repository.findByCategoryIn(categories);
        }
        
        return city != null 
            ? repository.findByCityContainingIgnoreCase(city)
            : repository.findAll();
    }

    public List<String> getAllCategories() {
        return repository.findDistinctCategories();
    }

    public long countByCategory(String category) {
        return repository.countByCategory(category);
    }

    public long countAllProducts() {
        return repository.count();
    }
}

/*package com.example.backend.service;

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
import java.time.LocalDate;

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

    public Product updateProduct(Integer id, Product product, List<MultipartFile> images) throws IOException {
        Product existingProduct = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Actualizar campos básicos
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setCity(product.getCity());
        existingProduct.setRating(product.getRating());

        // Actualizar la lista completa de imágenes si viene en el producto
        if (product.getImageUrls() != null) {
            existingProduct.setImageUrls(product.getImageUrls());
        }

        // Agregar nuevas imágenes si las hay
        if (images != null && !images.isEmpty()) {
            List<String> newImageUrls = saveImages(images);
            existingProduct.getImageUrls().addAll(newImageUrls);
        }

        return repository.save(existingProduct);
    }

    // Añade solo este nuevo método público (elimina el privado si lo habías añadido)
    public void deleteImageFiles(List<String> imageUrls) throws IOException {
        for (String imageUrl : imageUrls) {
            try {
                String filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                Path filePath = Paths.get(uploadDir).resolve(filename);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.err.println("Error al eliminar imagen: " + imageUrl);
                throw e; // Relanzamos la excepción
            }
        }
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
    
    public List<Product> listProducts() { 
        return repository.findAll(); 
    }
    
    public List<Product> getRandomProducts() { 
        return repository.findRandomProducts(); 
    }
    
    public void deleteProduct(Integer id) { 
        repository.deleteById(id); 
    }
    
    public Product getProductById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
    public void deleteProductsByCategory(String categoryName) {
    // Primero obtener todos los productos de esta categoría para eliminar sus imágenes
    List<Product> products = repository.findByCategory(categoryName);
    
    // Eliminar las imágenes de cada producto
    products.forEach(product -> {
        if (product.getImageUrls() != null && !product.getImageUrls().isEmpty()) {
            try {
                deleteImageFiles(product.getImageUrls());
            } catch (IOException e) {
                System.err.println("Error al eliminar imágenes del producto " + product.getId());
            }
        }
    });
    
    // Luego eliminar los productos
    repository.deleteByCategory(categoryName);
}
    public List<Product> searchProducts(String city, LocalDate checkIn, LocalDate checkOut, List<String> categories) {
        if (checkIn != null && checkOut != null) {
            // Validación básica de fechas
            if (checkOut.isBefore(checkIn)) {
                throw new IllegalArgumentException("Check-out date must be after check-in date");
            }
            
            return productRepository.findAvailableProducts(
                categories != null && !categories.isEmpty() ? categories.get(0) : null,
                city,
                checkIn,
                checkOut
            );
        }
        return productRepository.findByFilters(city, categories);
    }

    public List<String> getAllCategories() {
        return productRepository.findDistinctCategories();
    }
}
*/
/*package com.example.backend.service;

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
*/