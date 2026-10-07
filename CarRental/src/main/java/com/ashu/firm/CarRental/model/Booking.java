package com.ashu.firm.CarRental.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==============================
    // CUSTOMER DETAILS
    // ==============================

    private String customerName;

    private String customerEmail;


    // ==============================
    // CAR DETAILS
    // ==============================

    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;


    // ==============================
    // BOOKING DATES
    // ==============================

    private LocalDate startDate;

    private LocalDate endDate;


    // ==============================
    // PRICE
    // ==============================

    private Double totalPrice;


    // ==============================
    // BOOKING STATUS
    // ==============================
    // PENDING
    // APPROVED
    // REJECTED
    // COMPLETED

    private String status = "PENDING";


    // ==============================
    // PAYMENT DETAILS
    // ==============================

    // PAID / FAILED / PENDING

    private String paymentStatus;

    // Razorpay Payment ID

    private String paymentId;

    // Razorpay Order ID

    private String razorpayOrderId;

}