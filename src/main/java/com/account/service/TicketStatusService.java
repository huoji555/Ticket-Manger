package com.account.service;


import com.account.entity.TicketStatus;

public interface TicketStatusService {

    TicketStatus queryTicketStatusByCode(String code);

}
