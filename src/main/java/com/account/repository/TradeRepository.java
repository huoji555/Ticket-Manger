package com.account.repository;

import com.account.entity.Trade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface TradeRepository extends JpaRepository<Trade,String> {


    Trade queryTradeByDateAndTicketTypeAndTradeType(Date date,String ticketType,String tradeType);

    Trade queryTradeByDateAndTradeType(Date date,String tradeType);

    List<Trade> queryTradesByDate(Date date);


}
