package com.account.serviceImpl;

import com.account.entity.TicketDiscount;
import com.account.repository.TicketDiscountRepository;
import com.account.service.TicketDiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TicketDiscountImpl implements TicketDiscountService {

    @Autowired
    private TicketDiscountRepository ticketDiscountRepository;


    @Override
    public void save(TicketDiscount ticketDiscount) {
        ticketDiscountRepository.save(ticketDiscount);
    }

    @Override
    public TicketDiscount queryTicketDiscountByTicketNumber(String ticketNumber,String uploader) {
        return ticketDiscountRepository.queryTicketDicount(ticketNumber,uploader);
    }
}
