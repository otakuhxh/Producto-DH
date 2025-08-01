package com.example.backend.repository;

import com.example.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import java.time.LocalDate;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    boolean existsByName(String name);
    
    @Query(value = "SELECT * FROM product ORDER BY RAND() LIMIT 10", nativeQuery = true)
    List<Product> findRandomProducts();

    @Query("SELECT p FROM Product p WHERE p.category = :category")
    List<Product> findByCategory(@Param("category") String category);

    @Modifying
    @Query("DELETE FROM Product p WHERE p.category = :category")
    void deleteByCategory(@Param("category") String category);

    List<Product> findByCategoryIn(List<String> categories);
    
    List<Product> findByCityContainingIgnoreCase(String city);
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR p.category IN :categories) AND " +
           "(:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(NOT EXISTS (SELECT u FROM p.unavailableDates u WHERE u BETWEEN :checkIn AND :checkOut))")
    List<Product> findAvailableProducts(
        @Param("categories") List<String> categories,
        @Param("city") String city,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );
    
    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findDistinctCategories();

    long countByCategory(String category);


    @Query("SELECT p FROM Product p JOIN p.features f WHERE f.id = :featureId")
    List<Product> findByFeatureId(@Param("featureId") Integer featureId);

}

/*package com.example.backend.repository;

import com.example.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import java.time.LocalDate;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    boolean existsByName(String name);
    
    @Query(value = "SELECT * FROM product ORDER BY RAND()", nativeQuery = true)
    List<Product> findRandomProducts();

    @Query("SELECT p FROM Product p WHERE p.category = :category")
List<Product> findByCategory(@Param("category") String category);

    @Modifying
    @Query("DELETE FROM Product p WHERE p.category = :category")
    void deleteByCategory(@Param("category") String category);

    // Buscar por categoría
    List<Product> findByCategoryIn(List<String> categories);
    
    // Buscar por ciudad (insensible a mayúsculas)
    List<Product> findByCityContainingIgnoreCase(String city);
    
    // Buscar productos disponibles entre fechas
    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(NOT EXISTS (SELECT u FROM p.unavailableDates u WHERE u BETWEEN :checkIn AND :checkOut))")
    List<Product> findAvailableProducts(
        @Param("category") String category,
        @Param("city") String city,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );
    
    // Obtener categorías únicas
    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findDistinctCategories();

}
*/