package com.account.serviceImpl;

import com.account.entity.Trade;
import com.account.repository.TradeRepository;
import com.account.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
