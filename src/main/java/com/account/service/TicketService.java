package com.account.service;

import com.account.entity.Ticket;
import org.springframework.data.domain.Page;

public interface TicketService {

    void save(Ticket ticket);                                       //保存

    Page<Ticket> pageList(Integer page,Integer size,String adminId);               //分页

    Ticket queryTicketByNumber(String ticketNumber);                //根据票据号码，查询票据

    Ticket queryTicketByTicketNumberAndUploader(String ticketNumber,String uploder);

    Page<Ticket>  queryTicket(Integer page, Integer size, String ticketNumber, String ticketName, String billerName, String uploader);          //票据查询

}
