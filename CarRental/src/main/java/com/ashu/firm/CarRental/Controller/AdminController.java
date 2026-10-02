package com.ashu.firm.CarRental.Controller;

import com.ashu.firm.CarRental.model.Booking;
import com.ashu.firm.CarRental.model.Car;
import com.ashu.firm.CarRental.Repository.BookingRepository;
import com.ashu.firm.CarRental.Repository.CarRepository;
import org.springframework.web.bind.annotation.*;
import java.time.temporal.ChronoUnit;
import java.util.List;


    @RestController
    @RequestMapping("/api/admin")
//    @CrossOrigin(origins = "http://localhost:3000")
    @CrossOrigin(origins = "http://localhost:5173")
    public class AdminController {

        private final CarRepository carRepository;
        private final BookingRepository bookingRepository;

        public AdminController(
                CarRepository carRepository,
                BookingRepository bookingRepository) {

            this.carRepository = carRepository;
            this.bookingRepository = bookingRepository;
        }

        @PostMapping("/cars")
        public Car addCar(@RequestBody Car car) {
            car.setAvailable(true);
            return carRepository.save(car);
        }

        @GetMapping("/bookings")
        public List<Booking> getBookings() {
            return bookingRepository.findAll();
        }

        @PutMapping("/bookings/{id}/approve")
        public Booking approveBooking(@PathVariable Long id) {

            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Booking not found"));

            Car car = booking.getCar();

            if (!car.getAvailable()) {
                throw new RuntimeException("Car is unavailable");
            }

            booking.setStatus("APPROVED");
            car.setAvailable(false);

            carRepository.save(car);

            return bookingRepository.save(booking);
        }

        @PutMapping("/bookings/{id}/reject")
        public Booking rejectBooking(@PathVariable Long id) {

            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Booking not found"));

            booking.setStatus("REJECTED");

            return bookingRepository.save(booking);
        }
    }

