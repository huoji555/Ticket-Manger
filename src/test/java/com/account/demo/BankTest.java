package com.account.demo;

import com.account.entity.Bank;
import com.account.repository.BankRepository;
import com.account.util.ExcelResolve;
import com.account.util.JsonAnalyze;
import com.alibaba.fastjson.JSONArray;
import com.google.common.collect.Maps;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BankTest {


    @Autowired
    private ExcelResolve excelResolve;
    @Autowired
    private JsonAnalyze jsonAnalyze;
    @Autowired
    private BankRepository bankRepository;

    @Test
    public void readTest() throws Exception{
        File f1 = new File("D:/work/银行维护列表.xls");
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

            Bank bank = new Bank();

            for (Map.Entry<String,Object> entry : map.entrySet()){
                String head = entry.getKey().trim();
                String content = entry.getValue().toString().trim();
                bank = filling(head,content,bank);
            }

            /*if(bank.getBankName() != null){
                bankRepository.save(bank);
            }*/

            bankRepository.save(bank);
        }


    }


    public Bank filling(String key, String val, Bank bank) throws Exception{

        if(key == "类型" || key.equals("类型")){
            bank.setBankType(val);
        } else if (key == "银行简称" || key.equals("银行简称")){
            System.out.println("ppppppppppppppppppppppppp");

          /*try {
                if (bankRepository.queryBankByBankName(val) != null) {
                    return bank;
                }
              bank.setBankName(val);
            } catch (Exception e){
                e.printStackTrace();
            }*/
            //System.out.println();

            //bankRepository.queryBankByBankName(val);
            bank.setBankName(val);
        }
        return bank;
    }


}
