package com.ashu.firm.CarRental.Controller;

import com.ashu.firm.CarRental.Repository.CarRepository;
import com.ashu.firm.CarRental.model.Car;
import com.ashu.firm.CarRental.Service.CarService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:5173")
public class CarController {

    private final CarRepository carRepository;
    private final CarService carService;

    // Constructor injection for BOTH — no @Autowired field injection needed
    public CarController(CarRepository carRepository, CarService carService) {
        this.carRepository = carRepository;
        this.carService = carService;
    }

    // GET /api/cars              -> all cars
    // GET /api/cars?brand=Toyota -> only Toyota cars
    @GetMapping
    public List<Car> getCars(@RequestParam(required = false) String brand) {
        if (brand != null && !brand.isEmpty()) {
            return carService.getCarsByBrand(brand);
        }
        return carService.getAllCars();
    }

    @PostMapping
    public Car addCar(@RequestBody Car car) {
        car.setAvailable(true);
        return carService.addCar(car);
    }

    // Make car available
    @PutMapping("/{id}/available")
    public Car makeAvailable(@PathVariable Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        car.setAvailable(true);
        return carRepository.save(car);
    }

    // Make car unavailable
    @PutMapping("/{id}/unavailable")
    public Car makeUnavailable(@PathVariable Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        car.setAvailable(false);
        return carRepository.save(car);
    }
}