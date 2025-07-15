package com.example.demo.repository;

import com.example.demo.model.task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Taskrepository extends JpaRepository<task, Long> {
    // JpaRepository gives us all basic CRUD operations
}

