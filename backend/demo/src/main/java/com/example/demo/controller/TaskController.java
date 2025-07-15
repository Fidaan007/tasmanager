package com.example.demo.controller;

import com.example.demo.model.task;
import com.example.demo.repository.Taskrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private Taskrepository taskRepository;

    @GetMapping
    public List<task> getAllTasks() {
        return taskRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<task> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id);
    }

    @PostMapping
    public task createTask(@RequestBody task task) {
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public task updateTask(@PathVariable Long id, @RequestBody task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setDeadline(updatedTask.getDeadline());
            task.setCategory(updatedTask.getCategory());
            task.setDescription(updatedTask.getDescription());
            task.setProgress(updatedTask.getProgress());
            return taskRepository.save(task);
        }).orElseGet(() -> {
            updatedTask.setId(id);
            return taskRepository.save(updatedTask);
        });
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }
}
