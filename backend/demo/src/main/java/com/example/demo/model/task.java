package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data 
@NoArgsConstructor
@AllArgsConstructor
public class task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String deadline;
    private String category;
    private String description;
    private String progress ="Not Started";
}
