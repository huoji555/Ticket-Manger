package com.account.service;

import com.account.entity.Trade;

import java.util.Date;
import java.util.List;

public interface TradeService {

    Trade queryTrade(Date date, String ticketType, String tradeType);

    Trade queryTradeByDateAndTradeType(Date date,String tradeType);

    Trade queryTradeById(Integer id);

    List<Trade> queryListByDate(Date date);

    List<Trade> createListByDate();

    void save(Trade trade);


}
