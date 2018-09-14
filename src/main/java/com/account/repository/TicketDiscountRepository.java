package com.account.repository;

import com.account.entity.TicketDiscount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TicketDiscountRepository extends JpaRepository<TicketDiscount,String> {

   @Query(value = "select * from ticket_discount  td where td.ticket_number = ?1 and td.discount_uploader = ?2 order by create_date desc limit 1",nativeQuery = true)
   TicketDiscount queryTicketDicount(String ticketNumber,String uploader);

}
