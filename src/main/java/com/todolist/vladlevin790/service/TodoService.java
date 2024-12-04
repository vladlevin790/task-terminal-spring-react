package com.todolist.vladlevin790.service;

import com.todolist.vladlevin790.dto.TodoDTO;
import com.todolist.vladlevin790.exception.ResourceNotFoundException;
import com.todolist.vladlevin790.model.Todo;
import com.todolist.vladlevin790.model.User;
import com.todolist.vladlevin790.repository.TodoRepository;
import com.todolist.vladlevin790.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserService userService;

    public List<TodoDTO> getAllTodosByUserEmail(String userEmail) {
        User user = userService.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        return todoRepository.findAllByUser(user).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public TodoDTO createTodo(TodoDTO todoDTO, String userEmail) {
        User user = userService.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        
        Todo todo = Todo.builder()
            .title(todoDTO.getTitle())
            .description(todoDTO.getDescription())
            .completed(todoDTO.isCompleted())
            .user(user)
            .build();
        
        return toDTO(todoRepository.save(todo));
    }

    public TodoDTO getTodoByIdAndUserEmail(Long id, String userEmail) {
        User user = userService.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        Todo todo = todoRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        return toDTO(todo);
    }

    @Transactional
    public TodoDTO updateTodo(Long id, TodoDTO todoDTO, String userEmail) {
        User user = userService.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        Todo todo = todoRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        
        todo.setTitle(todoDTO.getTitle());
        todo.setDescription(todoDTO.getDescription());
        todo.setCompleted(todoDTO.isCompleted());
        
        return toDTO(todoRepository.save(todo));
    }

    @Transactional
    public void deleteTodo(Long id, String userEmail) {
        User user = userService.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        Todo todo = todoRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        todoRepository.delete(todo);
    }

    @Transactional
    public TodoDTO toggleTodoComplete(Long id, String userEmail) {
        User user = userService.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        Todo todo = todoRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        
        todo.setCompleted(!todo.isCompleted());
        return toDTO(todoRepository.save(todo));
    }

    private TodoDTO toDTO(Todo todo) {
        return TodoDTO.builder()
            .id(todo.getId())
            .title(todo.getTitle())
            .description(todo.getDescription())
            .completed(todo.isCompleted())
            .createdAt(todo.getCreatedAt())
            .updatedAt(todo.getUpdatedAt())
            .build();
    }
}
