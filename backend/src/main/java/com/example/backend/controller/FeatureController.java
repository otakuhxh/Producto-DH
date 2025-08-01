package com.example.backend.controller;

import com.example.backend.model.Feature;
import com.example.backend.service.FeatureService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/features")
@CrossOrigin(origins = "http://localhost:3000")
public class FeatureController {
    private final FeatureService service;

    public FeatureController(FeatureService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Feature createFeature(
            @RequestParam String name,
            @RequestParam String icon) {
        return service.saveFeature(name, icon);
    }

    @PutMapping("/{id}")
    public Feature updateFeature(
            @PathVariable Integer id,
            @RequestParam String name,
            @RequestParam String icon) {
        return service.updateFeature(id, name, icon);
    }

    @GetMapping
    public List<Feature> getAllFeatures() {
        return service.getAllFeatures();
    }

    @GetMapping("/{id}")
    public Feature getFeatureById(@PathVariable Integer id) {
        return service.getFeatureById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFeature(@PathVariable Integer id) {
        service.deleteFeature(id);
    }
}