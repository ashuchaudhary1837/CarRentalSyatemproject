package com.ashu.firm.CarRental.Controller;

import com.ashu.firm.CarRental.model.UserCar;
import com.ashu.firm.CarRental.Repository.UserCarRepository;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/user-cars")
@CrossOrigin(origins = "http://localhost:5173")
public class UserCarController {

    private final UserCarRepository userCarRepository;

    public UserCarController(UserCarRepository userCarRepository) {
        this.userCarRepository = userCarRepository;
    }

    // ==========================================
    // GET ALL CARS
    // ==========================================

    @GetMapping
    public List<UserCar> getAllUserCars() {
        return userCarRepository.findAll();
    }


    // ==========================================
    // ADD CAR
    // ==========================================

    @PostMapping
    public UserCar addUserCar(
            @RequestParam("brand") String brand,
            @RequestParam("model") String model,
            @RequestParam("variant") String variant,
            @RequestParam("manufactureYear") Integer manufactureYear,
            @RequestParam("dailyRate") Double dailyRate,
            @RequestParam("ownerName") String ownerName,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {

        UserCar car = new UserCar();

        car.setBrand(brand);
        car.setModel(model);
        car.setVariant(variant);
        car.setManufactureYear(manufactureYear);
        car.setDailyRate(dailyRate);
        car.setOwnerName(ownerName);
        car.setAvailable(true);


        // ==========================================
        // STORE IMAGE DIRECTLY IN DATABASE
        // ==========================================

        if (photo != null && !photo.isEmpty()) {

            try {

                car.setPhoto(photo.getBytes());

                car.setPhotoContentType(
                        photo.getContentType()
                );

            } catch (IOException e) {

                throw new RuntimeException(
                        "Failed to read image",
                        e
                );
            }
        }


        return userCarRepository.save(car);
    }


    // ==========================================
    // GET CAR IMAGE
    // ==========================================

    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> getCarPhoto(
            @PathVariable Long id
    ) {

        UserCar car = userCarRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Car not found"
                        )
                );


        if (car.getPhoto() == null ||
                car.getPhoto().length == 0) {

            return ResponseEntity.notFound().build();
        }


        MediaType mediaType =
                MediaType.IMAGE_JPEG;


        if (car.getPhotoContentType() != null) {

            try {

                mediaType = MediaType.parseMediaType(
                        car.getPhotoContentType()
                );

            } catch (Exception ignored) {

                mediaType = MediaType.IMAGE_JPEG;
            }
        }


        return ResponseEntity
                .ok()
                .contentType(mediaType)
                .body(car.getPhoto());
    }


    // ==========================================
    // MAKE CAR AVAILABLE
    // ==========================================

    @PutMapping("/{id}/available")
    public UserCar makeAvailable(
            @PathVariable Long id
    ) {

        UserCar car = userCarRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Car not found"
                        )
                );

        car.setAvailable(true);

        return userCarRepository.save(car);
    }


    // ==========================================
    // MAKE CAR UNAVAILABLE
    // ==========================================

    @PutMapping("/{id}/unavailable")
    public UserCar makeUnavailable(
            @PathVariable Long id
    ) {

        UserCar car = userCarRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Car not found"
                        )
                );

        car.setAvailable(false);

        return userCarRepository.save(car);
    }
}