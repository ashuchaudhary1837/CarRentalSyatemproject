import React, { useEffect, useState } from "react";

export default function Admin() {

    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedRC, setSelectedRC] = useState(null);

    // =========================
    // LOAD CARS
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

            setBookings(data);

        } catch (error) {

            console.error(
                "Error loading bookings:",
                error
            );

        }
    };


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        loadCars();
        loadBookings();

    }, []);


    // =========================
    // TOGGLE CAR AVAILABILITY
    // =========================

    const toggleAvailability = async (car) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/cars/${car.id}/available`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(!car.available)
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to update availability"
                );
            }

            // Refresh cars
            loadCars();

        } catch (error) {

            console.error(
                "Error updating availability:",
                error
            );

            alert("Unable to update car availability");

        }
    };


    // =========================
    // APPROVE BOOKING
    // =========================

    const approveBooking = async (bookingId) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/admin/bookings/${bookingId}/approve`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to approve booking"
                );
            }

            alert("Booking approved successfully");

            loadBookings();
            loadCars();

        } catch (error) {

            console.error(
                "Error approving booking:",
                error
            );

            alert("Unable to approve booking");

        }
    };


    // =========================
    // DELETE BOOKING
    // =========================

    const deleteBooking = async (bookingId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this booking?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/bookings/${bookingId}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to delete booking"
                );
            }

            alert("Booking deleted successfully");

            loadBookings();
            loadCars();

        } catch (error) {

            console.error(
                "Error deleting booking:",
                error
            );

            alert("Unable to delete booking");

        }
    };


    return (

        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f5f6fa",
                padding: "30px"
            }}
        >

            {/* ================================= */}
            {/* PAGE TITLE */}
            {/* ================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px"
                }}
            >

                <h2
                    style={{
                        fontWeight: "700",
                        margin: 0
                    }}
                >
                    🚗 Admin Dashboard
                </h2>

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        loadCars();
                        loadBookings();
                    }}
                >
                    🔄 Refresh
                </button>

            </div>


            {/* ================================= */}
            {/* MANAGE CARS */}
            {/* ================================= */}

            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "25px",
                    marginBottom: "35px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.08)"
                }}
            >

                <h3
                    style={{
                        fontWeight: "600",
                        marginBottom: "20px"
                    }}
                >
                    Manage Cars
                </h3>


                {cars.length === 0 ? (

                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#777"
                        }}
                    >
                        No cars available.
                    </div>

                ) : (

                    /*
                     * 3 columns
                     * 2 rows visible naturally = 6 cards
                     */

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, 1fr)",
                            gap: "20px"
                        }}
                    >

                        {cars.map((car) => (

                            <div
                                key={car.id}
                                style={{
                                    backgroundColor:
                                        "#ffffff",
                                    border:
                                        "1px solid #dddddd",
                                    borderRadius:
                                        "12px",
                                    overflow: "hidden",
                                    boxShadow:
                                        "0 4px 12px rgba(0,0,0,0.10)",
                                    minWidth: 0
                                }}
                            >

                                {/* ================= */}
                                {/* CAR IMAGE */}
                                {/* ================= */}

                                <div
                                    style={{
                                        width: "100%",
                                        height: "180px",
                                        backgroundColor:
                                            "#f7f7f7"
                                    }}
                                >

                                    <img
                                        src={`http://localhost:8080/api/user-cars/${car.id}/photo`}
                                        alt={`${car.brand} ${car.model}`}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit:
                                                "contain",
                                            display: "block"
                                        }}
                                    />

                                </div>


                                {/* ================= */}
                                {/* CAR INFORMATION */}
                                {/* ================= */}

                                <div
                                    style={{
                                        padding: "16px"
                                    }}
                                >

                                    <h5
                                        style={{
                                            fontWeight:
                                                "700",
                                            marginBottom:
                                                "8px"
                                        }}
                                    >
                                        {car.brand}{" "}
                                        {car.model}
                                    </h5>


                                    <p
                                        style={{
                                            margin:
                                                "4px 0",
                                            color: "#555"
                                        }}
                                    >
                                        <strong>
                                            Year:
                                        </strong>{" "}
                                        {car.year}
                                    </p>


                                    <p
                                        style={{
                                            margin:
                                                "4px 0",
                                            color: "#555"
                                        }}
                                    >
                                        <strong>
                                            Daily Rate:
                                        </strong>{" "}
                                        ₹{car.dailyRate}
                                    </p>


                                    {/* STATUS */}

                                    <p
                                        style={{
                                            marginTop:
                                                "8px",
                                            marginBottom:
                                                "12px"
                                        }}
                                    >

                                        <span
                                            style={{
                                                padding:
                                                    "5px 10px",
                                                borderRadius:
                                                    "20px",
                                                fontSize:
                                                    "13px",
                                                backgroundColor:
                                                    car.available
                                                        ? "#d4edda"
                                                        : "#f8d7da",
                                                color:
                                                    car.available
                                                        ? "#155724"
                                                        : "#721c24"
                                            }}
                                        >
                                            {car.available
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>

                                    </p>


                                    {/* ================= */}
                                    {/* BUTTONS */}
                                    {/* ================= */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap: "8px",
                                            flexWrap:
                                                "wrap"
                                        }}
                                    >

                                        {/* AVAILABILITY BUTTON */}

                                        <button
                                            className={`btn ${
                                                car.available
                                                    ? "btn-danger"
                                                    : "btn-success"
                                            }`}
                                            style={{
                                                flex:
                                                    "1"
                                            }}
                                            onClick={() =>
                                                toggleAvailability(
                                                    car
                                                )
                                            }
                                        >
                                            {car.available
                                                ? "Make Unavailable"
                                                : "Make Available"}
                                        </button>


                                        {/* VIEW RC */}

                                        <button
                                            className="btn btn-primary"
                                            style={{
                                                flex:
                                                    "1"
                                            }}
                                            onClick={() =>
                                                setSelectedRC(
                                                    car
                                                )
                                            }
                                        >
                                            View RC
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* ================================= */}
            {/* BOOKING REQUESTS */}
            {/* ================================= */}

            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "25px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.08)"
                }}
            >

                <h3
                    style={{
                        fontWeight: "600",
                        marginBottom: "20px"
                    }}
                >
                    📋 Booking Requests
                </h3>


                {bookings.length === 0 ? (

                    <div
                        style={{
                            textAlign: "center",
                            padding: "30px",
                            color: "#777"
                        }}
                    >
                        No booking requests found.
                    </div>

                ) : (

                    <div
                        style={{
                            overflowX: "auto"
                        }}
                    >

                        <table
                            className="table table-bordered table-hover"
                            style={{
                                verticalAlign:
                                    "middle"
                            }}
                        >

                            <thead
                                className="table-dark"
                            >

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Car
                                    </th>

                                    <th>
                                        Start Date
                                    </th>

                                    <th>
                                        End Date
                                    </th>

                                    <th>
                                        Total Price
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {bookings.map(
                                    (booking) => (

                                        <tr
                                            key={
                                                booking.id
                                            }
                                        >

                                            <td>
                                                {
                                                    booking.id
                                                }
                                            </td>


                                            <td>
                                                {
                                                    booking.customerName
                                                }
                                            </td>


                                            <td>
                                                {
                                                    booking.customerEmail
                                                }
                                            </td>


                                            <td>

                                                {booking.car
                                                    ? `${booking.car.brand} ${booking.car.model}`
                                                    : "N/A"}

                                            </td>


                                            <td>
                                                {
                                                    booking.startDate
                                                }
                                            </td>


                                            <td>
                                                {
                                                    booking.endDate
                                                }
                                            </td>


                                            <td>
                                                ₹
                                                {
                                                    booking.totalPrice
                                                }
                                            </td>


                                            <td>

                                                <span
                                                    className={`badge ${
                                                        booking.status ===
                                                        "APPROVED"
                                                            ? "bg-success"
                                                            : booking.status ===
                                                              "REJECTED"
                                                            ? "bg-danger"
                                                            : "bg-warning text-dark"
                                                    }`}
                                                >
                                                    {
                                                        booking.status
                                                    }
                                                </span>

                                            </td>


                                            <td>

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        gap:
                                                            "8px"
                                                    }}
                                                >

                                                    {/* APPROVE */}

                                                    {booking.status ===
                                                        "PENDING" && (

                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() =>
                                                                approveBooking(
                                                                    booking.id
                                                                )
                                                            }
                                                        >
                                                            Approve
                                                        </button>

                                                    )}


                                                    {/* DELETE */}

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            deleteBooking(
                                                                booking.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ================================= */}
            {/* RC IMAGE POPUP */}
            {/* ================================= */}

            {selectedRC && (

                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor:
                            "rgba(0,0,0,0.75)",
                        display: "flex",
                        justifyContent:
                            "center",
                        alignItems: "center",
                        zIndex: 9999,
                        padding: "20px"
                    }}

                    // Clicking outside popup closes it
                    onClick={() =>
                        setSelectedRC(null)
                    }
                >

                    {/* ======================= */}
                    {/* RC POPUP */}
                    {/* ======================= */}

                    <div
                        style={{
                            backgroundColor:
                                "#ffffff",
                            borderRadius:
                                "12px",
                            padding: "20px",
                            width: "90%",
                            maxWidth: "700px",
                            maxHeight: "90vh",
                            textAlign:
                                "center",
                            position:
                                "relative"
                        }}

                        // Prevent popup from closing
                        // when clicking inside
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* CLOSE ICON */}

                        <button
                            onClick={() =>
                                setSelectedRC(null)
                            }
                            style={{
                                position:
                                    "absolute",
                                top: "10px",
                                right: "10px",
                                border: "none",
                                background:
                                    "#dc3545",
                                color: "#ffffff",
                                width: "35px",
                                height: "35px",
                                borderRadius:
                                    "50%",
                                fontSize:
                                    "20px",
                                cursor:
                                    "pointer"
                            }}
                        >
                            ×
                        </button>


                        {/* TITLE */}

                        <h4
                            style={{
                                marginBottom:
                                    "15px",
                                paddingRight:
                                    "40px"
                            }}
                        >
                            RC -{" "}
                            {selectedRC.brand}{" "}
                            {selectedRC.model}
                        </h4>


                        {/* RC IMAGE */}

                        <img
                            src={`http://localhost:8080/api/user-cars/${selectedRC.id}/rc-photo`}
                            alt="Vehicle RC"
                            style={{
                                width: "100%",
                                maxHeight:
                                    "65vh",
                                objectFit:
                                    "contain",
                                borderRadius:
                                    "8px",
                                border:
                                    "1px solid #ddd",
                                backgroundColor:
                                    "#f8f8f8"
                            }}
                        />


                        {/* CLOSE BUTTON */}

                        <button
                            className="btn btn-danger"
                            style={{
                                marginTop:
                                    "15px",
                                minWidth:
                                    "100px"
                            }}
                            onClick={() =>
                                setSelectedRC(null)
                            }
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}