package com.example.backend.repository;

import com.example.backend.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query; // <-- IMPORTAR Query
import com.example.backend.model.Product;         // <-- IMPORTAR Product

public interface FeatureRepository extends JpaRepository<Feature, Integer> {
    boolean existsByName(String name);
    //List<Feature> findByNameContainingIgnoreCase(String name);
    //List<Feature> findByProducts_Id(Integer productId);

     @Query("SELECT p FROM Product p JOIN p.features f WHERE f.id = :featureId")
    List<Product> findByFeatureId(Integer featureId);
}