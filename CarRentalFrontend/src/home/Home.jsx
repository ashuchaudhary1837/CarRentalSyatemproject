import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {

    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [loading, setLoading] = useState(false);

    const [booking, setBooking] = useState({
        customerName: "",
        customerEmail: "",
        startDate: "",
        endDate: ""
    });


    // ==============================
    // LOAD RAZORPAY SCRIPT
    // ==============================

    useEffect(() => {

        const script = document.createElement("script");

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };

    }, []);


    // ==============================
    // LOAD CARS
    // ==============================

    useEffect(() => {
        fetchCars();
    }, []);


    const fetchCars = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8080/api/cars"
            );

            setCars(response.data);

        } catch (error) {

            console.error(
                "Error loading cars:",
                error
            );

        }
    };


    // ==============================
    // HANDLE INPUT CHANGE
    // ==============================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setBooking((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ==============================
    // SELECT CAR
    // ==============================

    const handleBookNow = (car) => {

        setSelectedCar(car);

        setBooking({
            customerName: "",
            customerEmail: "",
            startDate: "",
            endDate: ""
        });

    };


    // ==============================
    // CLOSE MODAL
    // ==============================

    const closeBooking = () => {

        if (!loading) {
            setSelectedCar(null);
        }

    };


    // =========================================================
    // PAY & SEND BOOKING REQUEST
    // =========================================================

    const handlePayment = async () => {

        if (!selectedCar) {
            alert("Please select a car");
            return;
        }


        // ------------------------------
        // VALIDATE FORM
        // ------------------------------

        if (
            !booking.customerName.trim() ||
            !booking.customerEmail.trim() ||
            !booking.startDate ||
            !booking.endDate
        ) {

            alert("Please fill all booking details");

            return;
        }


        // ------------------------------
        // VALIDATE DATE
        // ------------------------------

        const start =
            new Date(booking.startDate);

        const end =
            new Date(booking.endDate);


        if (end <= start) {

            alert(
                "End date must be after start date"
            );

            return;
        }


        try {

            setLoading(true);


            // =====================================================
            // STEP 1
            // CREATE RAZORPAY ORDER
            // =====================================================

            const orderResponse =
                await axios.post(
                    "http://localhost:8080/api/payment/create-order",
                    {
                        carId: selectedCar.id,

                        customerName:
                            booking.customerName,

                        customerEmail:
                            booking.customerEmail,

                        startDate:
                            booking.startDate,

                        endDate:
                            booking.endDate
                    }
                );


            const order = orderResponse.data;

            console.log(
                "Order created:",
                order
            );


            // =====================================================
            // STEP 2
            // RAZORPAY OPTIONS
            // =====================================================

            const options = {

                // ==========================================
                // YOUR RAZORPAY TEST KEY ID
                // ==========================================

                key: "rzp_test_Tkzhsf8zUbi6wG",


                // Amount returned by backend
                // Razorpay uses paise

                amount: order.amount,


                currency: order.currency,


                name: "Car Rental System",


                description:
                    `Booking for ${selectedCar.brand} ${selectedCar.model}`,


                // Razorpay Order ID

                order_id: order.orderId,


                // ==========================================
                // CUSTOMER DETAILS
                // ==========================================

                prefill: {

                    name:
                        booking.customerName,

                    email:
                        booking.customerEmail

                },


                // ==========================================
                // EXTRA INFORMATION
                // ==========================================

                notes: {

                    carId:
                        String(selectedCar.id),

                    startDate:
                        booking.startDate,

                    endDate:
                        booking.endDate

                },


                // ==========================================
                // RAZORPAY THEME
                // ==========================================

                theme: {

                    color: "#0d6efd"

                },


                // =====================================================
                // STEP 3
                // PAYMENT SUCCESS HANDLER
                // =====================================================

                handler: async function (response) {

                    console.log(
                        "Payment successful:",
                        response
                    );


                    try {

                        // =================================================
                        // STEP 4
                        // SEND PAYMENT DETAILS TO BACKEND
                        // =================================================

                        const verifyResponse =
                            await axios.post(
                                "http://localhost:8080/api/payment/verify",
                                {

                                    razorpayOrderId:
                                        response.razorpay_order_id,

                                    razorpayPaymentId:
                                        response.razorpay_payment_id,

                                    razorpaySignature:
                                        response.razorpay_signature,

                                    carId:
                                        selectedCar.id,

                                    customerName:
                                        booking.customerName,

                                    customerEmail:
                                        booking.customerEmail,

                                    startDate:
                                        booking.startDate,

                                    endDate:
                                        booking.endDate
                                }
                            );


                        console.log(
                            "Verification response:",
                            verifyResponse.data
                        );


                        // ==========================================
                        // PAYMENT VERIFIED
                        // BOOKING CREATED
                        // ==========================================

                        alert(
                            "Payment successful! Your booking has been approved."
                        );


                        // Close modal

                        setSelectedCar(null);


                        // Reset form

                        setBooking({
                            customerName: "",
                            customerEmail: "",
                            startDate: "",
                            endDate: ""
                        });


                        // Reload cars
                        // Car will now be unavailable

                        await fetchCars();


                    } catch (error) {

                        console.error(
                            "Verification error:",
                            error
                        );


                        alert(
                            error.response?.data?.message ||
                            "Payment verification failed."
                        );

                    } finally {

                        setLoading(false);

                    }

                },


                // =====================================================
                // PAYMENT WINDOW CLOSED
                // =====================================================

                modal: {

                    ondismiss: function () {

                        console.log(
                            "Razorpay checkout closed"
                        );

                        setLoading(false);

                    }

                }

            };


            // =====================================================
            // CHECK RAZORPAY SCRIPT
            // =====================================================

            if (!window.Razorpay) {

                alert(
                    "Razorpay is not loaded. Please refresh the page."
                );

                setLoading(false);

                return;
            }


            // =====================================================
            // CREATE RAZORPAY OBJECT
            // =====================================================

            const razorpay =
                new window.Razorpay(options);


            // =====================================================
            // PAYMENT FAILED
            // =====================================================

            razorpay.on(
                "payment.failed",
                function (response) {

                    console.error(
                        "Payment failed:",
                        response
                    );

                    setLoading(false);

                    alert(
                        "Payment failed. Booking was not created."
                    );

                }
            );


            // =====================================================
            // OPEN RAZORPAY CHECKOUT
            // =====================================================

            razorpay.open();


        } catch (error) {

            console.error(
                "Create order error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Unable to create Razorpay order."
            );


            setLoading(false);

        }

    };


    // =========================================================
    // JSX
    // =========================================================

    return (

        <div>

            {/* ============================
                NAVBAR
            ============================ */}

            <nav className="navbar navbar-dark bg-dark">

                <div className="container">

                    <Link
                        to="/home"
                        className="navbar-brand"
                    >
                        🚗 Car Rental
                    </Link>

                    <Link
                        to="/login"
                        className="btn btn-outline-light"
                    >
                        Login
                    </Link>

                </div>

            </nav>


            {/* ============================
                CARS
            ============================ */}

            <div className="container mt-4">

                <h2 className="mb-4">
                    Available Cars
                </h2>


                <div className="row">

                    {cars.map((car) => (

                        <div
                            className="col-md-4 mb-4"
                            key={car.id}
                        >

                            <div className="card h-100 shadow-sm">


                                {/* CAR IMAGE */}

                                {car.imageUrl && (

                                    <img
                                        src={car.imageUrl}
                                        alt={
                                            `${car.brand} ${car.model}`
                                        }
                                        className="card-img-top"
                                        style={{
                                            height: "220px",
                                            objectFit: "cover"
                                        }}
                                    />

                                )}


                                <div className="card-body">

                                    <h5 className="card-title">

                                        {car.brand}{" "}
                                        {car.model}

                                    </h5>


                                    <p>
                                        Year: {car.year}
                                    </p>


                                    <p>
                                        ₹{car.dailyRate} / day
                                    </p>


                                    <p>

                                        Status:{" "}

                                        {car.available ? (

                                            <span className="text-success fw-bold">
                                                Available
                                            </span>

                                        ) : (

                                            <span className="text-danger fw-bold">
                                                Unavailable
                                            </span>

                                        )}

                                    </p>


                                    {car.available && (

                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={() =>
                                                handleBookNow(car)
                                            }
                                        >
                                            Book Now
                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>


            {/* =================================================
                BOOKING MODAL
            ================================================= */}

            {selectedCar && (

                <div
                    className="modal d-block"
                    style={{
                        backgroundColor:
                            "rgba(0,0,0,0.6)"
                    }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">


                            {/* MODAL HEADER */}

                            <div className="modal-header">

                                <h5 className="modal-title">

                                    Book{" "}
                                    {selectedCar.brand}{" "}
                                    {selectedCar.model}

                                </h5>


                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeBooking}
                                    disabled={loading}
                                />

                            </div>


                            {/* MODAL BODY */}

                            <div className="modal-body">


                                {/* NAME */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Customer Name
                                    </label>

                                    <input
                                        type="text"
                                        name="customerName"
                                        className="form-control"
                                        placeholder="Enter your name"
                                        value={
                                            booking.customerName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                {/* EMAIL */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="customerEmail"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={
                                            booking.customerEmail
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                {/* START DATE */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        name="startDate"
                                        className="form-control"
                                        value={
                                            booking.startDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                {/* END DATE */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        name="endDate"
                                        className="form-control"
                                        value={
                                            booking.endDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                {/* PAYMENT MESSAGE */}

                                <div className="alert alert-info">

                                    <strong>
                                        Payment Required
                                    </strong>

                                    <br />

                                    Your payment will be
                                    completed before the
                                    booking is created.

                                </div>

                            </div>


                            {/* MODAL FOOTER */}

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeBooking}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handlePayment}
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Processing..."
                                        : "💳 Pay & Send Booking Request"}

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}