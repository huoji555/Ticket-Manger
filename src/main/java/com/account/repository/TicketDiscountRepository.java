package com.account.repository;

import com.account.entity.TicketDiscount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface TicketDiscountRepository extends JpaRepository<TicketDiscount,String> {

   @Query(value = "select * from ticket_discount  td where td.ticket_number = ?1 and td.discount_uploader = ?2 order by create_date desc limit 1",nativeQuery = true)
   TicketDiscount queryTicketDicount(String ticketNumber,String uploader);


   //财务模块查询
   @Query(value = "select tic.ticket_number,tic.ticket_amount,dis.discount_amount,tic.discount_status,dis.commission " +
           "from ticket tic " +
           "left join ticket_discount dis " +
           "on tic.ticket_number=dis.ticket_number " +
           "and dis.create_date=(select max(create_date) from ticket_discount where ticket_number=tic.ticket_number) " +
           "where 1=1 "+
           "and tic.uploader = :uploader " +
           "and (case when :firstDate!='' and :lastDate!='' then dis.create_date between :firstDate and (select date_add(:lastDate,interval 1 day)) or tic.uploader = :uploader and dis.create_date is null " +
           "else dis.create_date between (select date_sub(now(),interval 1 week)) and (select now()) or tic.uploader = :uploader and dis.create_date is null end)",
            nativeQuery = true)
   List<Object[]> queryDisountByDate(@Param("uploader") String uploader, @Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate);




   /*查询已贴现的票据信息*/
   @Query(value = "select tic.ticket_number,tic.ticket_amount,dis.discount_amount,dis.commission,dis.discount_preice,dis.discount_type," +
           "dis.discount_party,dis.create_date from ticket tic " +
           "left join ticket_discount dis " +
           "on tic.ticket_number=dis.ticket_number " +
           "and dis.create_date=(select max(create_date) from ticket_discount where ticket_number=tic.ticket_number) " +
           "where 1=1 "+
           "and tic.uploader = :uploader " +
           "and (case when :firstDate!='' and :lastDate!='' then dis.create_date between :firstDate and (select date_add(:lastDate,interval 1 day)) " +
           "else dis.create_date between (select date_sub(now(),interval 1 week)) and (select now()) end)",
           nativeQuery = true)
   List<Object[]> queryDiscountTotalsByDate(@Param("uploader") String uploader, @Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate);


}
