import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyBookings() {

    const [bookings, setBookings] = useState([]);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {

        fetchBookings();

    }, []);

    const fetchBookings = async () => {

        try {

            const response = await axios.get(
                `http://localhost:8080/api/bookings/user?email=${user.email}`
            );

            setBookings(response.data);

        } catch (error) {

            console.error(
                "Error fetching bookings:",
                error
            );

        }

    };

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    My Booking Requests
                </h2>

                <Link
                    to="/home"
                    className="btn btn-secondary"
                >
                    Back to Home
                </Link>

            </div>

            {bookings.length === 0 ? (

                <div className="alert alert-info">
                    You don't have any booking requests yet.
                </div>

            ) : (

                <div className="row">

                    {bookings.map((booking) => (

                        <div
                            className="col-md-6 mb-4"
                            key={booking.id}
                        >

                            <div className="card shadow">

                                <div className="card-body">

                                    <h4>
                                        {booking.car.brand}{" "}
                                        {booking.car.model}
                                    </h4>

                                    <hr />

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

                                        {booking.status === "PENDING" && (
                                            <span className="badge bg-warning text-dark">
                                                PENDING
                                            </span>
                                        )}

                                        {booking.status === "APPROVED" && (
                                            <span className="badge bg-success">
                                                APPROVED
                                            </span>
                                        )}

                                        {booking.status === "REJECTED" && (
                                            <span className="badge bg-danger">
                                                REJECTED
                                            </span>
                                        )}

                                        {booking.status === "COMPLETED" && (
                                            <span className="badge bg-primary">
                                                COMPLETED
                                            </span>
                                        )}

                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default MyBookings;