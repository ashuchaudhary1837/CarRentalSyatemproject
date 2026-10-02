package com.ashu.firm.CarRental.Service;

import com.ashu.firm.CarRental.model.Booking;
import com.ashu.firm.CarRental.model.Car;
import com.ashu.firm.CarRental.Repository.BookingRepository;
import com.ashu.firm.CarRental.Repository.CarRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingScheduler {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;

    public BookingScheduler(
            BookingRepository bookingRepository,
            CarRepository carRepository) {

        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
    }

    // Runs every hour
    @Scheduled(fixedRate = 3600000)
    public void releaseExpiredBookings() {

        List<Booking> bookings = bookingRepository.findAll();

        LocalDate today = LocalDate.now();

        for (Booking booking : bookings) {

            if ("APPROVED".equalsIgnoreCase(booking.getStatus())
                    && !booking.getEndDate().isAfter(today)) {

                Car car = booking.getCar();

                car.setAvailable(true);

                booking.setStatus("COMPLETED");

                carRepository.save(car);
                bookingRepository.save(booking);
            }
        }
    }
}
