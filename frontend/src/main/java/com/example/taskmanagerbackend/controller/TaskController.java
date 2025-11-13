package com.example.taskmanagerbackend.controller;

import com.example.taskmanagerbackend.model.Task;
import com.example.taskmanagerbackend.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // allow React frontend
@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskRepository taskRepository;
    public TaskController(TaskRepository taskRepository) { 
    	this.taskRepository = taskRepository; 
    	}

    @GetMapping
    public List<Task> getAllTasks() {
    	return taskRepository.findAll(); 
    	}

    @PostMapping
    public Task createTask(@RequestBody Task task) {
    	return taskRepository.save(task); 
    	}

    @PutMapping("/{id}/complete")
    public Task completeTask(@PathVariable Long id) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setCompleted(true);
        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) { 
    	taskRepository.deleteById(id); 
    	}
    
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        return taskRepository.save(task);
    }

}
