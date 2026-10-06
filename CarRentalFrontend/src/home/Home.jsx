import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function Home() {

  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [booking, setBooking] = useState({
    customerName: '',
    customerEmail: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/user-cars'); // fixed: hyphen not underscore
      setCars(res.data);
    } catch (err) {
      console.error('Error fetching cars:', err);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCar) return;
    const payload = {
      ...booking,
      car: { id: selectedCar.id }
    };
    try {
      await axios.post('http://localhost:8080/api/bookings', payload);
      alert('Your Booking Request Is Sent Succesfully !');
      setSelectedCar(null);
      setBooking({ customerName: '', customerEmail: '', startDate: '', endDate: '' });
      fetchCars();
    } catch (err) {
      alert('Failed to create booking: ' + (err.response?.data?.message || err.message));
    }
  };

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <header>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            My Account
          </button>

          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item" to="/my-bookings">
                My Bookings
              </Link>
            </li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </header>

      <main style={{ marginTop: "15px", marginBottom: "15px" }}>

        <div className="container text-center">
          <h3 className="mb-4">Welcome to Car Rental 🚗</h3>
          <p>Rent your favorite car easily and quickly.</p>

          <h1>
            <button className="btn btn-primary" onClick={() => navigate("/list")}>
              List Your Own Car
            </button>
          </h1>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>

          {cars.length === 0 ? (
            <p className="text-center text-muted">No cars listed yet.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              
           {cars.map((car) => (
  <div
    key={car.id}
    style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '15px'
    }}
  > 

    <img
      src={`http://localhost:8080/api/user-cars/${car.id}/photo`}
      alt={car.model}
      style={{
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        borderRadius: '4px'
      }}
    />

    <h3>
      {car.brand} {car.model}
    </h3>

    <p>
      <strong>Variant:</strong> {car.variant}
    </p>

    <p>
      <strong>Manufacture Year:</strong> {car.manufactureYear}
    </p>

    <p>
      <strong>Rate:</strong> ₹{car.dailyRate}/day
    </p>

    <p>
      <strong>Owner:</strong> {car.ownerName}
    </p>

    <p>
      <strong>Status:</strong>{" "}
      {car.available ? 'Available' : 'Unavailable'}
    </p>

    <button
      disabled={!car.available}
      onClick={() => setSelectedCar(car)}
      style={{
        width: '100%',
        padding: '10px',
        backgroundColor: car.available
          ? '#007bff'
          : '#ccc',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: car.available
          ? 'pointer'
          : 'not-allowed'
      }}
    >
      {car.available ? 'Book Now' : 'Unavailable'}
    </button>

  </div>
))}

          {selectedCar && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '400px' }}>
                <h2>Book {selectedCar.brand} {selectedCar.model}</h2>
                <form onSubmit={handleBookingSubmit}>
                  <div style={{ marginBottom: '10px' }}>
                    <label>Name:</label>
                    <input
                      type="text"
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                      value={booking.customerName}
                      onChange={(e) => setBooking({ ...booking, customerName: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input
                      type="email"
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                      value={booking.customerEmail}
                      onChange={(e) => setBooking({ ...booking, customerEmail: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label>Start Date:</label>
                    <input
                      type="date"
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                      value={booking.startDate}
                      onChange={(e) => setBooking({ ...booking, startDate: e.target.value })}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label>End Date:</label>
                    <input
                      type="date"
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                      value={booking.endDate}
                      onChange={(e) => setBooking({ ...booking, endDate: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1, padding: '10px', backgroundColor: '#28a745',
                        color: '#fff', border: 'none', borderRadius: '4px'
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCar(null)}
                      style={{
                        flex: 1, padding: '10px', backgroundColor: '#dc3545',
                        color: '#fff', border: 'none', borderRadius: '4px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
          )}
        </div>
      </main>

      <footer className="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom">
        <div className="container text-center">
          <p className="text-white">
            © 2026 Car Rental System | All Rights Reserved | Thanx For Visiting Our Site
          </p>
        </div>
      </footer>
    </div>
  );
}