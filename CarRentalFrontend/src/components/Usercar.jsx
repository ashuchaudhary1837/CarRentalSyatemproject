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
    const [ownerContact, setOwnerContact] = useState("");
    const [variant, setVariant] = useState("");

    // Uploaded files
    const [photo, setPhoto] = useState(null);
    const [rcPhoto, setRcPhoto] = useState(null);

    // Preview images
    const [photoPreview, setPhotoPreview] = useState(
        passedState.imageUrl || ""
    );

    const [rcPhotoPreview, setRcPhotoPreview] = useState("");

    // Maximum file size = 10 MB
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    // --------------------------------------------------
    // Car Photo
    // --------------------------------------------------
    const handlePhotoChange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            return;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            alert("Car photo must be less than 10 MB.");
            e.target.value = "";
            return;
        }

        // Check image type
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            e.target.value = "";
            return;
        }

        setPhoto(file);

        // Create preview
        setPhotoPreview(URL.createObjectURL(file));
    };


    // --------------------------------------------------
    // RC Photo
    // --------------------------------------------------
    const handleRcPhotoChange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            return;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            alert("RC photo must be less than 10 MB.");
            e.target.value = "";
            return;
        }

        // Check image type
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid RC image.");
            e.target.value = "";
            return;
        }

        setRcPhoto(file);

        // Create RC preview
        setRcPhotoPreview(URL.createObjectURL(file));
    };


    // --------------------------------------------------
    // Submit
    // --------------------------------------------------
    const handleSubmit = async (e) => {

        e.preventDefault();

        // Validate normal fields
        if (
            !manufactureYear ||
            !dailyRate ||
            !ownerName ||
            !ownerContact ||
            !variant
        ) {
            alert("Please fill in all required details.");
            return;
        }

        // Require car photo
        if (!photo) {
            alert("Please upload your car photo.");
            return;
        }

        // Require RC photo
        if (!rcPhoto) {
            alert("Please upload your RC photo.");
            return;
        }

        const formData = new FormData();

        // Text fields
        formData.append("brand", brand);
        formData.append("model", model);
        formData.append("variant", variant);
        formData.append("manufactureYear", manufactureYear);
        formData.append("dailyRate", dailyRate);
        formData.append("ownerName", ownerName);
        formData.append("ownerContact", ownerContact);

        // Images
        formData.append("photo", photo);
        formData.append("rcphoto", rcPhoto);

        try {

            const response = await fetch(
                "http://localhost:8080/api/user-cars",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                throw new Error(
                    errorText || "Failed to add car"
                );
            }

            alert("Car added successfully!");

            // Navigate after successful submission
            navigate("/");

        } catch (error) {

            console.error("Error adding car:", error);

            alert(
                error.message ||
                "Could not add car. Please try again."
            );
        }
    };


    // --------------------------------------------------
    // If user opens /add-car directly
    // --------------------------------------------------
    if (!brand || !model) {

        return (
            <div className="text-center mt-5">

                <p>
                    No car selected. Please go back and choose a car first.
                </p>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/")}
                >
                    Go Back
                </button>

            </div>
        );
    }


    // --------------------------------------------------
    // UI
    // --------------------------------------------------
    return (

        <div
            className="container mt-4"
            style={{ maxWidth: "500px" }}
        >

            <h2 className="mb-4">
                Add Your Car Details
            </h2>

            <form onSubmit={handleSubmit}>

                {/* Brand */}
                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Brand
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={brand}
                        disabled
                    />

                </div>


                {/* Model */}
                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Model
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={model}
                        disabled
                    />

                </div>


                {/* Default / Selected Car Image */}
                {photoPreview && (

                    <div className="mb-3 text-center">

                        <img
                            src={photoPreview}
                            alt={model}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "200px",
                                borderRadius: "8px"
                            }}
                        />

                    </div>

                )}


                {/* Variant */}
                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Variant
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={variant}
                        onChange={(e) =>
                            setVariant(e.target.value)
                        }
                        required
                    />

                </div>


                {/* Manufacture Year */}
                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Manufacture Year
                    </label>

                    <input
                        type="number"
                        className="form-control"
                        min="1990"
                        max={new Date().getFullYear()}
                        value={manufactureYear}
                        onChange={(e) =>
                            setManufactureYear(e.target.value)
                        }
                        required
                    />

                </div>


                {/* Daily Rate */}
                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Daily Rate (₹)
                    </label>

                    <input
                        type="number"
                        className="form-control"
                        value={dailyRate}
                        onChange={(e) =>
                            setDailyRate(e.target.value)
                        }
                        required
                    />

                </div>


                {/* Owner Name */}
                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Owner Name
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={ownerName}
                        onChange={(e) =>
                            setOwnerName(e.target.value)
                        }
                        required
                    />

                </div>


                {/* Owner Contact */}
                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Owner Contact
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={ownerContact}
                        onChange={(e) =>
                            setOwnerContact(e.target.value)
                        }
                        required
                    />

                </div>


                {/* Car Photo */}
                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Upload Car Photo
                    </label>

                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        required
                    />

                    <small className="text-muted">
                        Maximum size: 10 MB
                    </small>

                </div>


                {/* Car Photo Preview */}
                {photoPreview && (

                    <div className="mb-3 text-center">

                        <img
                            src={photoPreview}
                            alt="Car Preview"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "200px",
                                borderRadius: "8px"
                            }}
                        />

                    </div>

                )}


                {/* RC Photo */}
                <div className="mb-3">

                    <label className="form-label fw-bold">
                        Upload RC Photo
                    </label>

                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleRcPhotoChange}
                        required
                    />

                    <small className="text-muted">
                        Maximum size: 10 MB
                    </small>

                </div>


                {/* RC Photo Preview */}
                {rcPhotoPreview && (

                    <div className="mb-3 text-center">

                        <img
                            src={rcPhotoPreview}
                            alt="RC Preview"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "200px",
                                borderRadius: "8px"
                            }}
                        />

                    </div>

                )}


                {/* Submit */}
                <button
                    type="submit"
                    className="btn btn-primary w-100"
                >
                    Submit Car Listing
                </button>

            </form>

        </div>
    );
}
