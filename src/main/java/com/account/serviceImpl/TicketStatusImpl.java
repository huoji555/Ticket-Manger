package com.account.serviceImpl;


import com.account.entity.TicketStatus;
import com.account.repository.TicketStatusRepository;
import com.account.service.TicketStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TicketStatusImpl implements TicketStatusService {

    @Autowired
    private TicketStatusRepository ticketStatusRepository;


    @Override
    public TicketStatus queryTicketStatusByCode(String code) {
        return ticketStatusRepository.queryTicketStatusByTicketStatusCode(code);
    }



}
