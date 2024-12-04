package com.todolist.vladlevin790.controller;

import com.todolist.vladlevin790.dto.TodoDTO;
import com.todolist.vladlevin790.model.User;
import com.todolist.vladlevin790.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<TodoDTO>> getAllTodos(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(todoService.getAllTodosByUserEmail(user.getEmail()));
    }

    @PostMapping
    public ResponseEntity<TodoDTO> createTodo(
            @Valid @RequestBody TodoDTO todoDTO,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(todoService.createTodo(todoDTO, user.getEmail()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoDTO> getTodo(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(todoService.getTodoByIdAndUserEmail(id, user.getEmail()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoDTO> updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody TodoDTO todoDTO,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(todoService.updateTodo(id, todoDTO, user.getEmail()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        todoService.deleteTodo(id, user.getEmail());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<TodoDTO> toggleTodoComplete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(todoService.toggleTodoComplete(id, user.getEmail()));
    }
}
