import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { todoApi } from '../services/api';

const TodoContainer = styled(motion.div)`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(10, 10, 10, 0.9);
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
    animation: borderGlow 3s ease-in-out infinite alternate;
  }
`;

const TodoForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const TodoInput = styled(motion.input)`
  flex: 1;
  padding: 1rem;
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

const TodoTextArea = styled(motion.textarea)`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid var(--primary-color);
  color: var(--text-color);
  font-family: 'Orbitron', sans-serif;
  border-radius: 5px;
  resize: vertical;
  min-height: 100px;
  overflow: hidden;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 15px var(--accent-color);
  }
`;

const TodoButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
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

const TodoList = styled(motion.ul)`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
`;

const TodoItem = styled(motion.li)`
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid var(--primary-color);
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  position: relative;
  transform-origin: center;

  &:hover {
    box-shadow: 0 0 15px var(--primary-color);
  }
`;

const TodoTitle = styled.h3`
  margin: 0;
  color: ${props => props.completed ? 'var(--secondary-color)' : 'var(--text-color)'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const TodoActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: var(--primary-color);
    color: var(--background-color);
    box-shadow: 0 0 10px var(--primary-color);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
  background: rgba(10, 10, 10, 0.95);
  padding: 2rem;
  border-radius: 10px;
  border: 2px solid var(--primary-color);
  box-shadow: 0 0 30px var(--primary-color);
  z-index: 1000;
  min-width: 300px;
  max-width: 600px;
  width: 90%;
  margin: 0 auto;
`;

const ModalDescription = styled.p`
  margin: 1rem 0;
  color: var(--text-color);
  font-size: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
  backdrop-filter: blur(5px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CyberHeader = styled(motion.h1)`
  color: var(--primary-color);
  margin: 0;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const LogoutButton = styled(TodoButton)`
  padding: 0.5rem 1rem;
`;

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isDescriptionClosing, setIsDescriptionClosing] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await todoApi.getAll();
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
        if (error.status === 403) {
          logout();
        }
      }
    };

    fetchTodos();
  }, [logout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo = {
      title: title.trim(),
      description: description.trim(),
      completed: false
    };

    try {
      const response = await todoApi.create(newTodo);
      setTodos([response.data, ...todos]);
      setIsDescriptionClosing(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setTitle('');
      setDescription('');
      setIsDescriptionClosing(false);
    } catch (error) {
      console.error('Error creating todo:', error);
      if (error.status === 403) {
        logout();
      }
    }
  };

  const toggleTodo = async (e, id) => {
    e.stopPropagation();
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      const response = await todoApi.update(id, {
        ...todoToUpdate,
        completed: !todoToUpdate.completed
      });
      setTodos(todos.map(todo =>
        todo.id === id ? response.data : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
      if (error.status === 403) {
        logout();
      }
    }
  };

  const deleteTodo = async (e, id) => {
    e.stopPropagation();
    try {
      await todoApi.delete(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      if (error.status === 403) {
        logout();
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const openTodoDetails = (todo) => {
    setSelectedTodo(todo);
  };

  const todoVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      x: -20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        mass: 0.5
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      x: 20,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        mass: 0.5
      }
    },
    hover: {
      x: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const listVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.5,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.5,
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <TodoContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <CyberHeader>Task Terminal</CyberHeader>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <TodoForm>
        <InputGroup>
          <TodoInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
          <TodoButton
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Task
          </TodoButton>
        </InputGroup>
        <AnimatePresence>
          {(title.trim() !== '' && !isDescriptionClosing) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: "auto", 
                opacity: 1,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 200,
                    damping: 25
                  },
                  opacity: {
                    duration: 0.2
                  }
                }
              }}
              exit={{ 
                height: 0, 
                opacity: 0,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 300,
                    damping: 35
                  },
                  opacity: {
                    duration: 0.2
                  }
                }
              }}
              style={{ overflow: 'hidden' }}
            >
              <TodoTextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description (optional)"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </TodoForm>

      <TodoList
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              variants={todoVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
              onClick={() => openTodoDetails(todo)}
              layout
            >
              <TodoTitle completed={todo.completed}>
                {todo.title}
              </TodoTitle>
              <TodoActions>
                <ActionButton
                  onClick={(e) => toggleTodo(e, todo.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {todo.completed ? '↺' : '✓'}
                </ActionButton>
                <ActionButton
                  onClick={(e) => deleteTodo(e, todo.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </ActionButton>
              </TodoActions>
            </TodoItem>
          ))}
        </AnimatePresence>
      </TodoList>

      <AnimatePresence>
        {selectedTodo && (
          <>
            <Overlay
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setSelectedTodo(null)}
            />
            <Modal
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CyberHeader>{selectedTodo.title}</CyberHeader>
              <ModalDescription>
                {selectedTodo.description || 'No description provided.'}
              </ModalDescription>
              <TodoButton 
                onClick={() => setSelectedTodo(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </TodoButton>
            </Modal>
          </>
        )}
      </AnimatePresence>
    </TodoContainer>
  );
};

export default TodoApp;
