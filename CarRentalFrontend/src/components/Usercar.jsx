import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddCarForm() {

    const location = useLocation();
    const navigate = useNavigate();

    // Data passed from BrandSelection page
    const passedState = location.state || {};
    const [brand] = useState(passedState.brand || "");
    const [model] = useState(passedState.model || "");
    const [manufactureYear, setManufactureYear] = useState("");
    const [dailyRate, setDailyRate] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [variant, setVariant] = useState("");
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(passedState.imageUrl || "");

    // If someone lands here directly without selecting a car first
    if (!brand || !model) {
        return (
            <div className="text-center mt-5">
                <p>No car selected. Please go back and choose a car first.</p>
                <button className="btn btn-primary" onClick={() => navigate("/")}>
                    Go Back
                </button>
            </div>
        );
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!manufactureYear || !dailyRate || !ownerName || !variant) {
            alert("Please fill in all required details.");
            return;
        }

        const formData = new FormData();
        formData.append("brand", brand);
        formData.append("model", model);
        formData.append("variant", variant);
        formData.append("manufactureYear", manufactureYear);
        formData.append("dailyRate", dailyRate);
        formData.append("ownerName", ownerName);
        if (photo) {
            formData.append("photo", photo);
        }

        try {
            const response = await fetch("http://localhost:8080/api/user-cars", {
                method: "POST",
                body: formData // no Content-Type header — browser sets it with boundary
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to add car");
            }

            alert("Car added successfully!");
            // navigate("/");

        } catch (error) {
            console.error("Error adding car:", error);
            alert(error.message || "Could not add car");
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: "500px" }}>
            <h2 className="mb-4">Add Your Car Details</h2>

            <form onSubmit={handleSubmit}>

                {/* Pre-filled, read-only fields */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Brand</label>
                    <input type="text" className="form-control" value={brand} disabled />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Model</label>
                    <input type="text" className="form-control" value={model} disabled />
                </div>

                {photoPreview && (
                    <div className="mb-3 text-center">
                        <img
                            src={photoPreview}
                            alt={model}
                            style={{ maxWidth: "100%", maxHeight: "200px" }}
                        />
                    </div>
                )}


                   <div className="mb-3">
                    <label className="form-label fw-bold">Variant</label>
                    <input
                        type="text"
                        className="form-control"
                        value={variant}
                        onChange={(e) => setVariant(e.target.value)}
                        required
                    />
                </div>


                {/* New fields */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Manufacture Year</label>
                    <input
                        type="number"
                        className="form-control"
                        min="1990"
                        max={new Date().getFullYear()}
                        value={manufactureYear}
                        onChange={(e) => setManufactureYear(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Daily Rate (₹)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={dailyRate}
                        onChange={(e) => setDailyRate(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Owner Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Upload Car Photo</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handlePhotoChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Submit Car Listing
                </button>
            </form>
        </div>
    );
}