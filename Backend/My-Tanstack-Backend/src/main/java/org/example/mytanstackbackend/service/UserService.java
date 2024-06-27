package org.example.mytanstackbackend.service;

import org.example.mytanstackbackend.entity.User;
import org.example.mytanstackbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User user) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setFirstName(user.getFirstName());
                    existingUser.setLastName(user.getLastName());
                    existingUser.setEmail(user.getEmail());
                    existingUser.setPhoneNumber(user.getPhoneNumber());
                    existingUser.setAge(user.getAge());
                    existingUser.setGender(user.getGender());
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    user.setId(id);
                    return userRepository.save(user);
                });
    }
}