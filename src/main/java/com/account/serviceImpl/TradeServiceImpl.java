package com.account.serviceImpl;

import com.account.entity.Trade;
import com.account.repository.TradeRepository;
import com.account.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class TradeServiceImpl implements TradeService {

   @Autowired
   private TradeRepository tradeRepository;


    @Override
    public Trade queryTrade(Date date, String ticketType, String tradeType) {
        return tradeRepository.queryTradeByDateAndTicketTypeAndTradeType(date,ticketType,tradeType);
    }

    @Override
    public Trade queryTradeByDateAndTradeType(Date date, String tradeType) {
        return tradeRepository.queryTradeByDateAndTradeType(date, tradeType);
    }


    @Override
    public List<Trade> queryListByDate(Date date) {
        return tradeRepository.queryTradesByDate(date);
    }


    @Override
    public void save(Trade trade) { tradeRepository.save(trade); }

    @Override
    public Trade queryTradeById(Integer id) { return tradeRepository.queryTradeById(id); }

    //生成每天的汇率数据
    @Override
    public List<Trade> createListByDate() {

        List<String> tradeType = new ArrayList();
        tradeType.add("贴现买断");
        tradeType.add("贴现复查");
        tradeType.add("质押");

        List<String> ticketType = new ArrayList();
        ticketType.add("国股");
        ticketType.add("城商");
        ticketType.add("农商");

        Date date1=null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String date = sdf.format(new Date());
        try {
            date1 = sdf.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        for ( int i=0; i<tradeType.size(); i++) {
            for(int j=0; j<ticketType.size(); j++) {
                Trade trade = new Trade();
                trade.setTradeType(tradeType.get(i));
                trade.setTicketType(ticketType.get(j));
                trade.setDate(date1);
                tradeRepository.save(trade);
            }
        }

        Trade lastTrade = new Trade();
        lastTrade.setTradeType("基准");
        lastTrade.setTicketType("基准");
        lastTrade.setDate(date1);
        tradeRepository.save(lastTrade);

        return null;
    }
}
