package com.ashu.firm.CarRental.Repository;

import com.ashu.firm.CarRental.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByAvailable(Boolean available);

    // Spring auto-generates the SQL query from this method name
    List<Car> findByBrand(String brand);

    // Bonus: case-insensitive version (handles "toyota" vs "Toyota")
    List<Car> findByBrandIgnoreCase(String brand);

}