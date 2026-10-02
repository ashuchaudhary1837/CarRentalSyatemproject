CREATE DATABASE IF NOT EXISTS car_rental_db;
USE car_rental_db;

CREATE TABLE cars (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                      brand VARCHAR(50) NOT NULL,
                      model VARCHAR(50) NOT NULL,
                      year INT NOT NULL,
                      daily_rate DECIMAL(10,2) NOT NULL,
                      available BOOLEAN DEFAULT TRUE,
                      image_url VARCHAR(255)
);

CREATE TABLE bookings (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          customer_name VARCHAR(100) NOT NULL,
                          customer_email VARCHAR(100) NOT NULL,
                          car_id BIGINT NOT NULL,
                          start_date DATE NOT NULL,
                          end_date DATE NOT NULL,
                          total_price DECIMAL(10,2) NOT NULL,
                          status VARCHAR(20) DEFAULT 'CONFIRMED',
                          FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);
