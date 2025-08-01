package com.example.backend.service;

import com.example.backend.model.Feature;
import com.example.backend.repository.FeatureRepository;
import org.springframework.stereotype.Service;
import com.example.backend.repository.ProductRepository; // <-- IMPORTAR ProductRepository
import com.example.backend.model.Product;          // <-- IMPORTAR Product
import java.util.List;

@Service
public class FeatureService {
    /*private final FeatureRepository repository;

    
    public FeatureService(FeatureRepository repository) {
        this.repository = repository;
    }*/

    private final FeatureRepository repository;
    private final ProductRepository productRepository;

    public FeatureService(FeatureRepository repository, ProductRepository productRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
    }

    public Feature saveFeature(String name, String icon) {
        Feature feature = new Feature();
        feature.setName(name);
        feature.setIcon(icon);
        return repository.save(feature);
    }

    public Feature updateFeature(Integer id, String name, String icon) {
        Feature feature = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feature not found"));
        feature.setName(name);
        feature.setIcon(icon);
        return repository.save(feature);
    }

    public List<Feature> getAllFeatures() {
        return repository.findAll();
    }

    public Feature getFeatureById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feature not found"));
    }
/*
    public void deleteFeature(Integer id) {
        repository.deleteById(id);
    }*/

   public void deleteFeature(Integer id) {
        Feature feature = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feature not found"));

        // Buscar productos que tengan esta característica
        List<Product> products = productRepository.findByFeatureId(id);

        // Quitar la relación del feature en cada producto
        for (Product product : products) {
            product.getFeatures().removeIf(f -> f.getId().equals(id));
            productRepository.save(product);
        }

        // Ahora sí eliminar el feature
        repository.delete(feature);
    }
}