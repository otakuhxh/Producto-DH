package com.example.backend.repository;

import com.example.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    boolean existsByName(String name);
    
    @Query(value = "SELECT * FROM product ORDER BY RAND()", nativeQuery = true)
    List<Product> findRandomProducts();
}