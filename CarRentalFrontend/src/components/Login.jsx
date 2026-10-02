import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import wallpaper from "../assets/wallpaper.png";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: email,
          password: password,
        }
      );

      console.log(response.data);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

      if (response.data.role === "ADMIN") {
        navigate("/Admin");
      } else {
        navigate("/home");
      }

    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message ||
          "Invalid email or password"
        );
      } else {
        setError("Cannot connect to server");
      }
    }
  };

  return (
    <div
      className="website-background"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="container">
        <div className="row justify-content-center">

          <div className="col-md-6 col-lg-5">

            <div className="card shadow login-card">

              <div className="card-body p-4">

                <h2 className="text-center mb-4">
                  Login
                </h2>

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin}>

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

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    Login
                  </button>

                </form>

                <div className="text-center mt-3">
                  Don't have an account?{" "}
                  <Link to="/register">
                    Register
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

export default Login;