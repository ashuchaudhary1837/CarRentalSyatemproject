import React, { useEffect, useState } from "react";

function Admin() {

    // =========================
    // STATES
    // =========================

    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);


    // =========================
    // LOAD CARS (from user_cars)
    // =========================

    const loadCars = async () => {
        try {

            const response = await fetch(
                "http://localhost:8080/api/user-cars"
            );

            if (!response.ok) {
                throw new Error("Failed to load cars");
            }

            const data = await response.json();

            setCars(data);

        } catch (error) {

            console.error("Error loading cars:", error);

        }
    };


    // =========================
    // LOAD BOOKINGS
    // =========================

    const loadBookings = async () => {
        try {

            const response = await fetch(
                "http://localhost:8080/api/bookings"
            );

            if (!response.ok) {
                throw new Error("Failed to load bookings");
            }

            const data = await response.json();

            console.log("Bookings:", data);

            setBookings(data);

        } catch (error) {

            console.error("Error loading bookings:", error);

        }
    };


    // =========================
    // LOAD DATA WHEN PAGE OPENS
    // =========================

    useEffect(() => {

        loadCars();
        loadBookings();

    }, []);


    // =========================
    // MAKE CAR UNAVAILABLE
    // =========================

    const makeUnavailable = async (id) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/user-cars/${id}/unavailable`,
                {
                    method: "PUT"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to make car unavailable"
                );
            }


            // Reload cars
            loadCars();

        } catch (error) {

            console.error(
                "Make unavailable error:",
                error
            );

            alert(error.message);
        }
    };


    // =========================
    // MAKE CAR AVAILABLE
    // =========================

    const makeAvailable = async (id) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/user-cars/${id}/available`,
                {
                    method: "PUT"
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to make car available"
                );
            }


            // Reload cars
            loadCars();

        } catch (error) {

            console.error(
                "Make available error:",
                error
            );

            alert(error.message);
        }
    };


    // =========================
    // APPROVE BOOKING
    // =========================

    const approveBooking = async (id) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/bookings/${id}/approve`,
                {
                    method: "PUT"
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to approve booking"
                );
            }


            const updatedBooking =
                await response.json();


            console.log(
                "Approved booking:",
                updatedBooking
            );


            // Update booking in React state
            setBookings(
                (previousBookings) =>
                    previousBookings.map(
                        (booking) =>
                            booking.id === id
                                ? updatedBooking
                                : booking
                    )
            );


            // Approved booking makes car unavailable
            loadCars();

        } catch (error) {

            console.error(
                "Approve booking error:",
                error
            );

            alert(error.message);
        }
    };


    // =========================
    // REJECT BOOKING
    // =========================

    const rejectBooking = async (id) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/bookings/${id}/reject`,
                {
                    method: "PUT"
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to reject booking"
                );
            }


            const updatedBooking =
                await response.json();


            console.log(
                "Rejected booking:",
                updatedBooking
            );


            setBookings(
                (previousBookings) =>
                    previousBookings.map(
                        (booking) =>
                            booking.id === id
                                ? updatedBooking
                                : booking
                    )
            );

        } catch (error) {

            console.error(
                "Reject booking error:",
                error
            );

            alert(error.message);
        }
    };


    // =========================
    // COMPLETE BOOKING
    // =========================

    const completeBooking = async (id) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/bookings/${id}/complete`,
                {
                    method: "PUT"
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to complete booking"
                );
            }


            const updatedBooking =
                await response.json();


            console.log(
                "Completed booking:",
                updatedBooking
            );


            setBookings(
                (previousBookings) =>
                    previousBookings.map(
                        (booking) =>
                            booking.id === id
                                ? updatedBooking
                                : booking
                    )
            );


            // Car becomes available again
            loadCars();

        } catch (error) {

            console.error(
                "Complete booking error:",
                error
            );

            alert(error.message);
        }
    };


    // =========================
    // CLEAR BOOKING
    // =========================

    const clearBooking = async (id) => {

        if (
            !window.confirm(
                "Are you sure you want to clear this booking?"
            )
        ) {

            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8080/api/bookings/${id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete booking"
                );
            }


            alert(
                "Booking request cleared successfully"
            );


            // Reload bookings
            loadBookings();

            // Reload cars
            loadCars();

        } catch (error) {

            console.error(
                "Error clearing booking:",
                error
            );

            alert(
                "Failed to clear booking"
            );
        }
    };


    // =========================
    // JSX
    // =========================

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "1000px",
                margin: "auto"
            }}
        >

            <h1>Admin Dashboard</h1>


            {/* ========================================= */}
            {/* BOOKING REQUESTS */}
            {/* ========================================= */}

            <hr />

            <h2>Booking Requests</h2>


            {bookings.length === 0 ? (

                <p>No booking requests found.</p>

            ) : (

                <div>

                    {bookings.map((booking) => (

                        <div
                            key={booking.id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "20px",
                                marginBottom: "15px",
                                borderRadius: "8px"
                            }}
                        >

                            <h3>
                                Booking #{booking.id}
                            </h3>


                            <p>
                                <strong>Car ID:</strong>{" "}
                                {booking.car?.id}
                            </p>


                            <p>
                                <strong>Customer Name:</strong>{" "}
                                {booking.customerName}
                            </p>


                            <p>
                                <strong>Customer Email:</strong>{" "}
                                {booking.customerEmail}
                            </p>


                            <p>
                                <strong>Start Date:</strong>{" "}
                                {booking.startDate}
                            </p>


                            <p>
                                <strong>End Date:</strong>{" "}
                                {booking.endDate}
                            </p>


                            <p>
                                <strong>Total Price:</strong>{" "}
                                ₹{booking.totalPrice}
                            </p>


                            <p>
                                <strong>Status:</strong>{" "}
                                {booking.status}
                            </p>


                            {/* PENDING */}

                            {booking.status === "PENDING" && (

                                <div>

                                    <button
                                        onClick={() =>
                                            approveBooking(
                                                booking.id
                                            )
                                        }
                                        style={{
                                            backgroundColor:
                                                "green",
                                            color: "white",
                                            border: "none",
                                            padding:
                                                "10px 15px",
                                            borderRadius:
                                                "5px",
                                            cursor:
                                                "pointer",
                                            marginRight:
                                                "10px"
                                        }}
                                    >
                                        Approve
                                    </button>


                                    <button
                                        onClick={() =>
                                            rejectBooking(
                                                booking.id
                                            )
                                        }
                                        style={{
                                            backgroundColor:
                                                "red",
                                            color: "white",
                                            border: "none",
                                            padding:
                                                "10px 15px",
                                            borderRadius:
                                                "5px",
                                            cursor:
                                                "pointer"
                                        }}
                                    >
                                        Reject
                                    </button>

                                </div>

                            )}


                            {/* APPROVED */}

                            {booking.status === "APPROVED" && (

                                <button
                                    onClick={() =>
                                        completeBooking(
                                            booking.id
                                        )
                                    }
                                    style={{
                                        backgroundColor:
                                            "blue",
                                        color: "white",
                                        border: "none",
                                        padding:
                                            "10px 15px",
                                        borderRadius:
                                            "5px",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    Complete Booking
                                </button>

                            )}


                            {/* COMPLETED */}

                            {booking.status === "COMPLETED" && (

                                <p>
                                    Booking completed.
                                    Car is available again.
                                </p>

                            )}


                            {/* REJECTED */}

                            {booking.status === "REJECTED" && (

                                <p>
                                    Booking request rejected.
                                </p>

                            )}


                            {/* CLEAR BOOKING */}

                            <button
                                onClick={() =>
                                    clearBooking(
                                        booking.id
                                    )
                                }
                                style={{
                                    backgroundColor:
                                        "darkorange",
                                    color: "white",
                                    border: "none",
                                    padding:
                                        "10px 15px",
                                    borderRadius:
                                        "5px",
                                    cursor:
                                        "pointer",
                                    marginTop:
                                        "15px"
                                }}
                            >
                                Clear Booking Request
                            </button>

                        </div>

                    ))}

                </div>

            )}


            {/* ========================================= */}
            {/* MANAGE CARS (from user_cars) */}
            {/* ========================================= */}

            <hr />

            <h2>Manage Cars</h2>


            {cars.length === 0 ? (

                <p>No cars found.</p>

            ) : (

                <div>

                    {cars.map((car) => (

                        <div
                            key={car.id}
                            style={{
                                border:
                                    "1px solid #ccc",
                                padding: "15px",
                                marginBottom:
                                    "10px",
                                borderRadius:
                                    "8px"
                            }}
                        >

                            {/* Car Image */}

                            {car.imageUrl && (

                                <img
                                    src={car.imageUrl}
                                    alt={
                                        `${car.brand} ${car.model}`
                                    }
                                    style={{
                                        width: "250px",
                                        height: "150px",
                                        objectFit:
                                            "cover",
                                        borderRadius:
                                            "8px",
                                        display:
                                            "block",
                                        marginBottom:
                                            "10px"
                                    }}
                                />

                            )}


                            <h3>
                                {car.brand}{" "}
                                {car.model}
                            </h3>


                            <p>
                                <strong>
                                    Car ID:
                                </strong>{" "}
                                {car.id}
                            </p>


                            <p>
                                <strong>
                                    Variant:
                                </strong>{" "}
                                {car.variant}
                            </p>


                            <p>
                                <strong>
                                    Manufacture Year:
                                </strong>{" "}
                                {car.manufactureYear}
                            </p>


                            <p>
                                <strong>
                                    Owner:
                                </strong>{" "}
                                {car.ownerName}
                            </p>


                            <p>
                                <strong>
                                    Daily Rate:
                                </strong>{" "}
                                ₹{car.dailyRate}
                            </p>


                            <p>
                                <strong>
                                    Status:
                                </strong>{" "}

                                {car.available
                                    ? "AVAILABLE"
                                    : "UNAVAILABLE"}

                            </p>


                            {/* AVAILABLE CAR */}

                            {car.available ? (

                                <button
                                    onClick={() =>
                                        makeUnavailable(
                                            car.id
                                        )
                                    }
                                    style={{
                                        backgroundColor:
                                            "red",
                                        color: "white",
                                        border: "none",
                                        padding:
                                            "10px 15px",
                                        borderRadius:
                                            "5px",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    Make Unavailable
                                </button>

                            ) : (

                                /* UNAVAILABLE CAR */

                                <button
                                    onClick={() =>
                                        makeAvailable(
                                            car.id
                                        )
                                    }
                                    style={{
                                        backgroundColor:
                                            "green",
                                        color: "white",
                                        border: "none",
                                        padding:
                                            "10px 15px",
                                        borderRadius:
                                            "5px",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    Make Available
                                </button>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Admin;