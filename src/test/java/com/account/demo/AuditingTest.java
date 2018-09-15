package com.account.demo;

import com.account.repository.AuditingRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AuditingTest {

    @Autowired
    private AuditingRepository auditingRepository;

    @Test
    public void queryAuditingByStatus(){
        Pageable pageable = new PageRequest(0,2);
        Page<Object[]> queryObject = auditingRepository.queryAuditingMessage("12580","1",pageable);


        System.out.println("执行了");
        System.out.println(queryObject.toString());
    }


}
