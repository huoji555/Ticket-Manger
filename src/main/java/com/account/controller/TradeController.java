package com.account.controller;

import com.account.entity.Trade;
import com.account.service.TradeService;
import com.account.util.ResultBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("trade")
public class TradeController {

    @Autowired
    private TradeService tradeService;


    /**
     * @author Ragty
     * @param  根据日期获取当天的票据利率信息
     * @serialData 2018.9.4
     * @param queryDate
     * @return
     * @throws Exception
     */
    @GetMapping("getTradeData")
    public ResultBean<List<Trade>> getTradeData(@RequestParam String queryDate) throws Exception{

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date time = sdf.parse(queryDate);

        List<Trade> list = tradeService.queryListByDate(time);

        return new ResultBean<List<Trade>>(list);
    }


    /*@PostMapping("save")
    public ResultBean<Map<String,Object>> save(){

    }*/



}
