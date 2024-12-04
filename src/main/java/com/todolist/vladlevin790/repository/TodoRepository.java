package com.todolist.vladlevin790.repository;

import com.todolist.vladlevin790.model.Todo;
import com.todolist.vladlevin790.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserId(Long userId);
    Optional<Todo> findByIdAndUserId(Long id, Long userId);
    void deleteByIdAndUserId(Long id, Long userId);
    
    List<Todo> findAllByUser(User user);
    Optional<Todo> findByIdAndUser(Long id, User user);
}
