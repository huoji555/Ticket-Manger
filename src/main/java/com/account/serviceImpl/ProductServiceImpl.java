package com.account.serviceImpl;

import com.account.entity.Product;
import com.account.repository.ProductRepository;
import com.account.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl  implements ProductService {

    @Autowired
    private ProductRepository productRepository;


    @Override
    public List<Product> getAll() {
        return  productRepository.findAll();
    }



}
