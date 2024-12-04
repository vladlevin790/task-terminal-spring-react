import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--background-color);
  overflow-x: hidden;
  padding: 20px;
  box-sizing: border-box;
`;

const CyberContainer = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: rgba(10, 10, 10, 0.9);
  border: 2px solid var(--primary-color);
  border-radius: 10px;
  box-shadow: 0 0 20px var(--primary-color);
  margin: 2rem auto;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 1024px) {
    max-width: 380px;
    padding: 1.75rem;
  }

  @media (max-width: 768px) {
    max-width: 340px;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 1.25rem;
    margin: 1rem auto;
    border-width: 1px;
  }

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    z-index: -1;
    border-radius: 12px;
    animation: borderGlow 3s ease-in-out infinite;
  }
`;

const CyberHeader = styled(motion.h1)`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  animation: glitch 3s infinite;
  position: relative;

  @media (max-width: 1024px) {
    font-size: 2.25rem;
    margin-bottom: 1.75rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    letter-spacing: 2px;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1.25rem;
    letter-spacing: 1.5px;
  }

  &:before, &:after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &:before {
    left: 2px;
    text-shadow: -2px 0 var(--secondary-color);
    animation: glitch-2 3s infinite reverse;
  }

  &:after {
    left: -2px;
    text-shadow: 2px 0 var(--accent-color);
    animation: glitch 3s infinite;
  }
`;

const CyberForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(10, 10, 10, 0.9);
  padding: 2rem;
  border-radius: 10px;
  border: 2px solid var(--primary-color);
  box-shadow: 0 0 20px var(--primary-color);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    z-index: -1;
    border-radius: 12px;
    opacity: 0.5;
    animation: borderGlow 6s ease-in-out infinite;
  }

  @keyframes borderGlow {
    0% {
      opacity: 0.3;
      box-shadow: 0 0 20px var(--primary-color);
    }
    50% {
      opacity: 0.5;
      box-shadow: 0 0 30px var(--primary-color);
    }
    100% {
      opacity: 0.3;
      box-shadow: 0 0 20px var(--primary-color);
    }
  }
`;

const CyberInput = styled(motion.input)`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid var(--primary-color);
  color: var(--text-color);
  font-family: 'Orbitron', sans-serif;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-size: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 1024px) {
    padding: 0.9rem;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.9rem;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
    border-width: 1px;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
    font-family: 'Orbitron', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 1px;

    @media (max-width: 768px) {
      font-size: 0.85rem;
    }

    @media (max-width: 480px) {
      font-size: 0.8rem;
      letter-spacing: 0.5px;
    }
  }

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 15px var(--accent-color);
  }
`;

const CyberButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: 1rem;

  @media (max-width: 1024px) {
    padding: 0.9rem;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.9rem;
    letter-spacing: 1.5px;
    margin-top: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.85rem;
    letter-spacing: 1px;
    border-width: 1px;
    margin-top: 0.75rem;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover {
    background: var(--primary-color);
    color: var(--background-color);
    box-shadow: 0 0 20px var(--primary-color);

    &:before {
      left: 100%;
    }
  }
`;

const CyberLink = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  position: relative;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    margin-top: 1.25rem;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    margin-top: 0.875rem;
    font-size: 0.85rem;
  }

  &:hover {
    text-shadow: 0 0 10px var(--primary-color);
  }

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -5px;
    left: 0;
    background: var(--primary-color);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover:before {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: var(--accent-color);
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  animation: textGlow 2s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.75rem;
  }
`;

const SuccessMessage = styled(motion.div)`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  animation: textGlow 2s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.75rem;
  }
`;

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password,
      });
      setShowVerification(true);
      setSuccessMessage('Registration successful! Please check your email for the verification code.');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/verify', {
        email,
        code: verificationCode
      });
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed. Please try again.');
    }
  };

  return (
    <PageWrapper>
      <CyberContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CyberHeader
          data-text="CREATE ACCOUNT"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          CREATE ACCOUNT
        </CyberHeader>
        {!showVerification ? (
          <CyberForm
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CyberInput
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
            <CyberInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
            <CyberInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
            <CyberInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            />
            <CyberButton
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Initialize Profile
            </CyberButton>
            {error && (
              <ErrorMessage
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </ErrorMessage>
            )}
          </CyberForm>
        ) : (
          <CyberForm
            onSubmit={handleVerificationSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {successMessage && (
              <SuccessMessage
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {successMessage}
              </SuccessMessage>
            )}
            <CyberInput
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Verification Code"
              required
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
            <CyberButton
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Verify Email
            </CyberButton>
            {error && (
              <ErrorMessage
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </ErrorMessage>
            )}
          </CyberForm>
        )}
        <CyberLink
          to="/login"
          as={motion.a}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Return to Login
        </CyberLink>
      </CyberContainer>
    </PageWrapper>
  );
}

export default Register;
