package com.account.service;

import com.account.entity.TicketDiscount;

public interface TicketDiscountService {

    void save(TicketDiscount ticketDiscount);

    TicketDiscount queryTicketDiscountByTicketNumber(String ticketNumber,String uploader);

}
