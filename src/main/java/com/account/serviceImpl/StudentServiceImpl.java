package com.account.serviceImpl;

import com.account.entity.student;
import com.account.repository.StudentRepository;
import com.account.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;


    @Override
    public void save(student student) {
        studentRepository.save(student);
    }
}
