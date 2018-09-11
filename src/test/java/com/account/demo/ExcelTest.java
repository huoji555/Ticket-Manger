package com.account.demo;


import com.account.entity.Bank;
import com.account.entity.Ticket;
import com.account.entity.TicketStatus;
import com.account.repository.BankRepository;
import com.account.repository.TicketRepository;
import com.account.repository.TicketStatusRepository;
import com.account.util.ExcelResolve;
import com.account.util.JsonAnalyze;
import com.alibaba.fastjson.JSONArray;
import com.google.common.collect.Maps;
import junit.framework.TestCase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ExcelTest extends TestCase {

    @Autowired
    private ExcelResolve excelResolve;
    @Autowired
    private JsonAnalyze jsonAnalyze;
    @Autowired
    private BankRepository bankRepository;
    @Autowired
    private TicketStatusRepository ticketStatusRepository;

    @Test
    public void readTest() throws Exception{
        File f1 = new File("D:/work/电票状态字典表 .xls");
        JSONArray jsonArray = new JSONArray();

        try {
            jsonArray = excelResolve.readExcel(f1);
            System.out.println(jsonArray);
        } catch (Exception e) {
            e.printStackTrace();
        }


        for (int i = 0; i<jsonArray.size(); i++){
            Map<String,Object> map = Maps.newHashMap();
            String json = jsonAnalyze.object2Json(jsonArray.get(i));
            map = jsonAnalyze.json2Map(json);

            //Bank bank = new Bank();
            TicketStatus ticketStatus = new TicketStatus();

            for (Map.Entry<String,Object> entry : map.entrySet()){
                String head = entry.getKey().trim();
                String content = entry.getValue().toString().trim();
                ticketStatus = filling(head,content,ticketStatus);
            }

             ticketStatusRepository.save(ticketStatus);

        }


    }


    public static TicketStatus filling(String key, String val, TicketStatus ticketStatus){

        if(key == "票据状态代码" || key.equals("票据状态代码")){
            ticketStatus.setTicketStatusCode(val);
        } else if (key == "票据状态名称" || key.equals("票据状态名称")){
            System.out.println("ppppppppppppppppppppppppp");
            ticketStatus.setTicketStatusName(val);
        }
        return ticketStatus;
    }


}
