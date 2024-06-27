package org.example.mytanstackbackend.repository;


import org.example.mytanstackbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}