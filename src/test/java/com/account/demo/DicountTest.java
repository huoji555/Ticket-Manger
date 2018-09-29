package com.account.demo;

import com.account.repository.TicketDiscountRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DicountTest {

    @Autowired
    private TicketDiscountRepository ticketDiscountRepository;

    @Test
    public void discountTest() throws Exception{

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date firstDate = sdf.parse("2018-9-18");
        Date lastDate =sdf.parse("2018-9-27");
        String uploader = "12580";

        List<Object[]> list = ticketDiscountRepository.queryDisountByDate(uploader,null,null);

        System.out.println("执行了");
        System.out.println(list.size());
    }

}
