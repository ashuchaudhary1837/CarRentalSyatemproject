import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BrandSelection() {

    const [brand, setBrand] = useState("");
    const [brandCars, setBrandCars] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleBrandChange = (e) => {
        setBrand(e.target.value);
    };

    useEffect(() => {
        if (!brand) {
            setBrandCars([]);
            return;
        }

        setLoading(true);

        fetch(`http://localhost:8080/api/cars?brand=${encodeURIComponent(brand)}`)
            .then((res) => res.json())
            .then((data) => setBrandCars(data))
            .catch((err) => {
                console.error("Error fetching cars:", err);
                setBrandCars([]);
            })
            .finally(() => setLoading(false));

    }, [brand]);

    // This is the key part — clicking a card navigates to the form,
    // carrying the selected brand/model along as route state
    const handleCarClick = (car) => {
        navigate("/add-car", {
            state: {
                brand: car.brand,
                model: car.model,
                imageUrl: car.imageUrl
            }
        });
    };

    return (
        <>
            <h1 style={{
                backgroundColor: "#007bff",
                textAlign: "center",
                color: "white",
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "30px"
            }}>
                List Your Own Car
            </h1>

            <div className="mb-4">
                <label className="form-label fw-bold">Select Your Car Brand</label>
                <select
                    className="form-select form-select-lg"
                    value={brand}
                    onChange={handleBrandChange}
                    required
                >
                    <option value="">Select car brand</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Tata">Tata</option>
                    <option value="Mahindra">Mahindra</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Ford">Ford</option>
                </select>
            </div>

            {brand && (
                <div className="mb-4">
                    <label className="form-label fw-bold">Select Car Model</label>

                    {loading ? (
                        <p>Loading cars...</p>
                    ) : brandCars.length === 0 ? (
                        <p className="text-muted">No {brand} cars found.</p>
                    ) : (
                        <div className="row g-3">
                            {brandCars.map((car) => (
                                <div className="col-6 col-md-3" key={car.id}>
                                    <button
                                        type="button"
                                        className="card h-100 border-0 p-0 w-100"
                                        style={{ cursor: "pointer", background: "none" }}
                                        onClick={() => handleCarClick(car)}
                                    >
                                        <img
                                            src={car.imageUrl}
                                            className="card-img-top"
                                            alt={car.model}
                                        />
                                        <div className="card-body text-center p-2">
                                            <p className="mb-0 fw-semibold">{car.model}</p>
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}