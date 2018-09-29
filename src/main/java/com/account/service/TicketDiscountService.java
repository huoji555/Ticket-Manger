package com.account.service;

import com.account.entity.TicketDiscount;

import java.util.Date;
import java.util.List;

public interface TicketDiscountService {

    void save(TicketDiscount ticketDiscount);

    TicketDiscount queryTicketDiscountByTicketNumber(String ticketNumber,String uploader);

    List<Object[]> queryDicountByDate(String uploader, Date firstDate, Date lastDate);

    List<Object[]> queryDiscountTotalsByDate(String uploader, Date firstDate, Date lastDate);

}
