package com.account.repository;

import com.account.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketStatusRepository extends JpaRepository<TicketStatus,String> {


   TicketStatus queryTicketStatusByTicketStatusCode(String ticketStatusCode);

}
