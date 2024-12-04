package com.todolist.vladlevin790.service;

import com.todolist.vladlevin790.dto.AuthResponse;
import com.todolist.vladlevin790.dto.RegisterRequest;
import com.todolist.vladlevin790.dto.VerificationRequest;
import com.todolist.vladlevin790.model.User;
import com.todolist.vladlevin790.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Transactional
    public com.todolist.vladlevin790.model.User registerUser(com.todolist.vladlevin790.model.User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerificationCode(generateVerificationCode());
        user.setVerified(false);

        com.todolist.vladlevin790.model.User savedUser = userRepository.save(user);
        sendVerificationEmail(savedUser);
        return savedUser;
    }

    @Transactional
    public com.todolist.vladlevin790.model.User verifyUser(String email, String code) {

        com.todolist.vladlevin790.model.User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (user.isVerified()) {
            throw new RuntimeException("User is already verified");
        }

        if (!code.equals(user.getVerificationCode())) {
            throw new RuntimeException("Invalid verification code");
        }

        try {
            user.setVerified(true);
            user.setVerificationCode(null);
            com.todolist.vladlevin790.model.User savedUser = userRepository.saveAndFlush(user);
            
            return savedUser;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save verified user: " + e.getMessage());
        }
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.todolist.vladlevin790.model.User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return user;
    }

    public Optional<com.todolist.vladlevin790.model.User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        com.todolist.vladlevin790.model.User user = com.todolist.vladlevin790.model.User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(request.getPassword())
                .build();
        
        com.todolist.vladlevin790.model.User registeredUser = registerUser(user);
        String token = jwtService.generateToken(com.todolist.vladlevin790.model.User.builder()
                .username(registeredUser.getEmail())
                .password(registeredUser.getPassword())
                .roles(Collections.singletonList("USER"))
                .build());
                
        return AuthResponse.builder()
                .token(token)
                .email(registeredUser.getEmail())
                .username(registeredUser.getUsername())
                .build();
    }

    public AuthResponse verify(VerificationRequest request) {
        com.todolist.vladlevin790.model.User verifiedUser = verifyUser(request.getEmail(), request.getCode());
        String token = jwtService.generateToken(com.todolist.vladlevin790.model.User.builder()
                .username(verifiedUser.getEmail())
                .password(verifiedUser.getPassword())
                .roles(Collections.singletonList("USER"))
                .build());
                
        return AuthResponse.builder()
                .token(token)
                .email(verifiedUser.getEmail())
                .username(verifiedUser.getUsername())
                .build();
    }

    @Transactional
    public void resendVerificationCode(String email) {
        com.todolist.vladlevin790.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) {
            throw new RuntimeException("User is already verified");
        }

        user.setVerificationCode(generateVerificationCode());
        userRepository.save(user);

        sendVerificationEmail(user);
    }

    private String generateVerificationCode() {
        return String.format("%06d", (int) (Math.random() * 1000000));
    }

    private void sendVerificationEmail(com.todolist.vladlevin790.model.User user) {
        String subject = "Verify your email address";
        String content = String.format("""
            Hello %s,
                        
            Thank you for registering. Please use the following code to verify your email address:
                        
            %s
                        
            This code will expire in 24 hours.
            """, 
            user.getUsername(), 
            user.getVerificationCode()
        );

        emailService.sendEmail(user.getEmail(), subject, content);
    }
}
