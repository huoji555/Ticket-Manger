package com.account.repository;

import com.account.entity.student;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @Auther: Ragty
 * @Date: 2018/8/8 17:12
 * @Description:
 */
public interface StudentRepository extends PagingAndSortingRepository<student,String> {
}
