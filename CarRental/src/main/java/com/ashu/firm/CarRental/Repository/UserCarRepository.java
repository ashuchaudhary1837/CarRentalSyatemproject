package com.ashu.firm.CarRental.Repository;

import com.ashu.firm.CarRental.model.UserCar;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCarRepository extends JpaRepository<UserCar, Long> {
}