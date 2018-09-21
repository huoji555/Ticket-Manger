package com.account.controller;

import com.account.entity.Trade;
import com.account.service.TradeService;
import com.account.util.JsonAnalyze;
import com.account.util.ResultBean;
import com.alibaba.fastjson.JSONObject;
import net.sf.json.JSONArray;
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
    @Autowired
    private JsonAnalyze jsonAnalyze;


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



    /**
     * @author Ragty
     * @param  自动生成当天的汇率表
     * @serialData 2018.9.20
     * @param currentDate
     * @return
     */
    @GetMapping("createTradeData")
    public ResultBean<Map<String,Object>> createTradeData(@RequestParam String currentDate) throws Exception{

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date curentTime = sdf.parse(currentDate);
        if (tradeService.queryListByDate(curentTime).size() <= 0) {
            System.out.println("没有，自动生成");
            tradeService.createListByDate();
        }

        return new ResultBean<>();
    }


    /**
     * @author Ragty
     * @param  保存(修改)每天的票价
     * @serialData 2018.9.21
     * @param requestJsonBody
     * @return
     * @throws Exception
     */
    @PostMapping("saveTradeData")
    public ResultBean<Map<String,Object>> saveTradeData(@RequestBody String requestJsonBody) throws Exception{

        Map<String,Object> map = jsonAnalyze.json2Map(requestJsonBody);

        JSONArray ja = JSONArray.fromObject(map.get("tradeList"));

        for (int i=0; i<ja.size(); i++) {
            Integer id = new Integer(ja.getJSONObject(i).get("id").toString());
            Float minRate = Float.parseFloat(ja.getJSONObject(i).get("minRate").toString());
            Float maxRate = Float.parseFloat(ja.getJSONObject(i).get("maxRate").toString());

            Trade trade = tradeService.queryTradeById(id);
            trade.setMinRate(minRate);
            trade.setMaxRate(maxRate);

            tradeService.save(trade);
        }

        return new ResultBean<>();
    }


}
