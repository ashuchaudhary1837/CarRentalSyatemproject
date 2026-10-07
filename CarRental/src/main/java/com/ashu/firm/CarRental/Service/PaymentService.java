package com.ashu.firm.CarRental.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ashu.firm.CarRental.Repository.BookingRepository;
import com.ashu.firm.CarRental.Repository.CarRepository;
import com.ashu.firm.CarRental.dto.PaymentRequest;
import com.ashu.firm.CarRental.dto.PaymentVerifyRequest;
import com.ashu.firm.CarRental.model.Booking;
import com.ashu.firm.CarRental.model.Car;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final CarRepository carRepository;
    private final BookingRepository bookingRepository;

    /*
     * Read Razorpay Secret Key from application.properties
     *
     * razorpay.key.secret=YOUR_SECRET_KEY
     */
    @Value("${razorpay.key.secret}")
    private String keySecret;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PaymentService(
            RazorpayClient razorpayClient,
            CarRepository carRepository,
            BookingRepository bookingRepository) {

        this.razorpayClient = razorpayClient;
        this.carRepository = carRepository;
        this.bookingRepository = bookingRepository;
    }


    // =====================================================
    // CREATE RAZORPAY ORDER
    // =====================================================

    public Map<String, Object> createOrder(
            PaymentRequest request) throws Exception {

        // -----------------------------------------
        // Find car
        // -----------------------------------------

        Car car = carRepository
                .findById(request.getCarId())
                .orElseThrow(() ->
                        new RuntimeException("Car not found")
                );


        // -----------------------------------------
        // Check car availability
        // -----------------------------------------

        if (!Boolean.TRUE.equals(car.getAvailable())) {

            throw new RuntimeException(
                    "Car is currently unavailable"
            );
        }


        // -----------------------------------------
        // Convert dates
        // -----------------------------------------

        LocalDate startDate =
                LocalDate.parse(request.getStartDate());

        LocalDate endDate =
                LocalDate.parse(request.getEndDate());


        // -----------------------------------------
        // Validate dates
        // -----------------------------------------

        long days =
                ChronoUnit.DAYS.between(
                        startDate,
                        endDate
                );

        if (days <= 0) {

            throw new RuntimeException(
                    "End date must be after start date"
            );
        }


        // -----------------------------------------
        // Calculate total price
        // -----------------------------------------

        double totalPrice =
                days * car.getDailyRate();


        // -----------------------------------------
        // Convert INR to paise
        // -----------------------------------------

        long amountInPaise =
                Math.round(totalPrice * 100);


        if (amountInPaise <= 0) {

            throw new RuntimeException(
                    "Invalid payment amount"
            );
        }


        // =================================================
        // CREATE RAZORPAY ORDER
        // =================================================

        JSONObject orderRequest =
                new JSONObject();

        orderRequest.put(
                "amount",
                amountInPaise
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                "booking_" + System.currentTimeMillis()
        );


        /*
         * This is the actual Razorpay API call.
         *
         * RazorpayClient gets the Key ID and Secret Key
         * from RazorpayConfig.
         */
        Order order =
                razorpayClient.orders.create(
                        orderRequest
                );


        // =================================================
        // RESPONSE TO FRONTEND
        // =================================================

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "success",
                true
        );

        response.put(
                "orderId",
                order.get("id")
        );

        response.put(
                "amount",
                order.get("amount")
        );

        response.put(
                "currency",
                order.get("currency")
        );

        response.put(
                "carId",
                car.getId()
        );

        response.put(
                "totalPrice",
                totalPrice
        );

        response.put(
                "days",
                days
        );


        return response;
    }


    // =====================================================
    // VERIFY PAYMENT
    // =====================================================

    @Transactional
    public Map<String, Object> verifyPayment(
            PaymentVerifyRequest request) throws Exception {


        // =================================================
        // VERIFY RAZORPAY PAYMENT SIGNATURE
        // =================================================

        String payload =
                request.getRazorpayOrderId()
                        + "|"
                        + request.getRazorpayPaymentId();


        boolean signatureValid =
                Utils.verifySignature(
                        payload,
                        request.getRazorpaySignature(),
                        keySecret
                );


        if (!signatureValid) {

            throw new RuntimeException(
                    "Payment verification failed"
            );
        }


        // =================================================
        // FIND CAR
        // =================================================

        Car car = carRepository
                .findById(request.getCarId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Car not found"
                        )
                );


        // =================================================
        // CHECK CAR AVAILABILITY AGAIN
        // =================================================

        if (!Boolean.TRUE.equals(car.getAvailable())) {

            throw new RuntimeException(
                    "Car is no longer available"
            );
        }


        // =================================================
        // CONVERT DATES
        // =================================================

        LocalDate startDate =
                LocalDate.parse(
                        request.getStartDate()
                );

        LocalDate endDate =
                LocalDate.parse(
                        request.getEndDate()
                );


        // =================================================
        // CALCULATE RENTAL DAYS
        // =================================================

        long days =
                ChronoUnit.DAYS.between(
                        startDate,
                        endDate
                );


        if (days <= 0) {

            throw new RuntimeException(
                    "Invalid booking dates"
            );
        }


        // =================================================
        // CALCULATE TOTAL PRICE
        // =================================================

        double totalPrice =
                days * car.getDailyRate();


        // =================================================
        // CREATE BOOKING
        // =================================================

        Booking booking =
                new Booking();


        booking.setCustomerName(
                request.getCustomerName()
        );

        booking.setCustomerEmail(
                request.getCustomerEmail()
        );

        booking.setCar(car);

        booking.setStartDate(startDate);

        booking.setEndDate(endDate);

        booking.setTotalPrice(totalPrice);


        // =================================================
        // PAYMENT INFORMATION
        // =================================================

        booking.setPaymentStatus(
                "PAID"
        );

        booking.setPaymentId(
                request.getRazorpayPaymentId()
        );

        booking.setRazorpayOrderId(
                request.getRazorpayOrderId()
        );


        // =================================================
        // BOOKING STATUS
        // =================================================

        /*
         * Payment has been successfully verified.
         *
         * Currently this automatically approves the booking.
         */
        booking.setStatus(
                "APPROVED"
        );


        // =================================================
        // SAVE BOOKING
        // =================================================

        bookingRepository.save(
                booking
        );


        // =================================================
        // MAKE CAR UNAVAILABLE
        // =================================================

        car.setAvailable(false);

        carRepository.save(car);


        // =================================================
        // RESPONSE
        // =================================================

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "Payment successful and booking approved"
        );

        response.put(
                "bookingId",
                booking.getId()
        );

        response.put(
                "paymentId",
                request.getRazorpayPaymentId()
        );

        response.put(
                "orderId",
                request.getRazorpayOrderId()
        );

        response.put(
                "status",
                "APPROVED"
        );

        response.put(
                "paymentStatus",
                "PAID"
        );


        return response;
    }
}
