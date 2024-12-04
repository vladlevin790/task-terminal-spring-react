import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

const LoginContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

const CyberForm = styled(motion.form)`
  width: 100%;
  max-width: 400px;
  background: rgba(10, 10, 10, 0.9);
  padding: 2rem;
  border-radius: 10px;
  border: 2px solid var(--primary-color);
  box-shadow: 0 0 20px var(--primary-color);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

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
    animation: borderGlow 3s ease-in-out infinite alternate;
  }
`;

const CyberInput = styled(motion.input)`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid var(--primary-color);
  color: var(--text-color);
  font-family: 'Orbitron', sans-serif;
  border-radius: 5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 15px var(--accent-color);
    transform: scale(1.02);
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
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

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
    transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    background: var(--primary-color);
    color: var(--background-color);
    box-shadow: 0 0 20px var(--primary-color);
    transform: translateY(-2px);

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
  margin-top: 1rem;
  font-family: 'Orbitron', sans-serif;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    text-shadow: 0 0 10px var(--primary-color);
    transform: scale(1.05);
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
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover:before {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const CyberHeader = styled(motion.h1)`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;

  &:before, &:after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
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

const ErrorMessage = styled(motion.div)`
  color: var(--accent-color);
  text-align: center;
  margin-bottom: 1rem;
  animation: textGlow 2s ease-in-out infinite;
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login({ email, password });
      const { token, ...userData } = response.data;
      login(userData, token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <LoginContainer>
      <CyberForm
        variants={formVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
      >
        <CyberHeader
          data-text="Access Terminal"
          variants={itemVariants}
        >
          Access Terminal
        </CyberHeader>

        <AnimatePresence>
          {error && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </ErrorMessage>
          )}
        </AnimatePresence>

        <CyberInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          variants={itemVariants}
        />

        <CyberInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          variants={itemVariants}
        />

        <CyberButton
          type="submit"
          disabled={isLoading}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Accessing...' : 'Login'}
        </CyberButton>

        <CyberLink
          to="/register"
          as={motion.a}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          Create New Account
        </CyberLink>
      </CyberForm>
    </LoginContainer>
  );
};

export default Login;
