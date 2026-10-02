package com.ashu.firm.CarRental.Controller;


import com.ashu.firm.CarRental.model.Booking;
import com.ashu.firm.CarRental.model.Car;
import com.ashu.firm.CarRental.Repository.BookingRepository;
import com.ashu.firm.CarRental.Repository.CarRepository;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "http://localhost:5173")

public class BookingController {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;

    public BookingController(
            BookingRepository bookingRepository,
            CarRepository carRepository) {

        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
    }

    // Get all bookings - Admin can use this
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // User creates booking request
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {

        Car car = carRepository.findById(booking.getCar().getId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        // Car must be available when request is created
        if (!car.getAvailable()) {
            throw new RuntimeException("Car is currently unavailable");
        }

        long days = ChronoUnit.DAYS.between(
                booking.getStartDate(),
                booking.getEndDate()
        );

        if (days <= 0) {
            days = 1;
        }

        booking.setTotalPrice(days * car.getDailyRate());

        // IMPORTANT:
        // Do NOT make car unavailable here.
        // Admin must approve first.
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    //get booking requests by id to show user his booking request

    // Get bookings of a particular user
    @GetMapping("/user")
    public List<Booking> getUserBookings(@RequestParam String email) {

        return bookingRepository.findByCustomerEmail(email);
    }



    // Admin approves booking
    @PutMapping("/{id}/approve")
    public Booking approveBooking(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Prevent approving an already processed booking
        if ("APPROVED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("Booking is already approved");
        }

        if ("REJECTED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("Rejected booking cannot be approved");
        }

        Car car = booking.getCar();

        // Check car availability only when admin approves
        if (!car.getAvailable()) {
            throw new RuntimeException(
                    "Car is already unavailable or booked"
            );
        }

        // Approve booking
        booking.setStatus("APPROVED");

        // NOW make the car unavailable
        car.setAvailable(false);

        carRepository.save(car);

        return bookingRepository.save(booking);
    }

    // Admin rejects booking
    @PutMapping("/{id}/reject")
    public Booking rejectBooking(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("APPROVED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException(
                    "Approved booking cannot be rejected"
            );
        }

        booking.setStatus("REJECTED");

        // Car remains available
        return bookingRepository.save(booking);
    }


// Admin manually completes a booking
    @PutMapping("/{id}/complete")
    public Booking completeBooking(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"APPROVED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException(
                    "Only approved bookings can be completed"
            );
        }

        Car car = booking.getCar();

        // Booking is completed
        booking.setStatus("COMPLETED");

        // Make car available again
        car.setAvailable(true);

        carRepository.save(car);

        return bookingRepository.save(booking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // If booking was approved, make the car available again
        if ("APPROVED".equalsIgnoreCase(booking.getStatus())) {

            Car car = booking.getCar();
            car.setAvailable(true);

            carRepository.save(car);
        }

        bookingRepository.delete(booking);
    }
}

