import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import wallpaper from "../assets/wallpaper.png";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // Check passwords
        if (password !== confirmPassword) {

            setError("Passwords do not match");

            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:8080/api/auth/register",
                {
                    name: name,
                    email: email,
                    password: password
                }
            );

            setSuccess(response.data.message);

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            // Go to login after 1.5 seconds
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Registration failed"
                );

            } else {

                setError(
                    "Cannot connect to server"
                );
            }
        }
    };


    return (

         <div
              className="website-background"
              style={{ backgroundImage: `url(${wallpaper})` }}
            >

        <div className="container">

            <div className="row justify-content-center mt-5">

                <div className="col-md-6 col-lg-5">

                    <div className="card shadow">

                        <div className="card-body p-4">

                            <h2 className="text-center mb-4">
                                Register
                            </h2>


                            {error && (

                                <div className="alert alert-danger">
                                    {error}
                                </div>

                            )}


                            {success && (

                                <div className="alert alert-success">
                                    {success}
                                </div>

                            )}


                            <form onSubmit={handleRegister}>

                                {/* NAME */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                    />

                                </div>


                                {/* EMAIL */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />

                                </div>


                                {/* PASSWORD */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />

                                </div>


                                {/* CONFIRM PASSWORD */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Register
                                </button>

                            </form>


                            <div className="text-center mt-3">

                                Already have an account?

                                {" "}

                                <Link to="/login">
                                    Login
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        </div>
    );
}

export default Register;