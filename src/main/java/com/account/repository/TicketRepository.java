package com.account.repository;

import com.account.entity.Ticket;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Date;
import java.util.List;

@RepositoryRestResource(path = "ticket")
public interface TicketRepository extends PagingAndSortingRepository<Ticket,String>, JpaSpecificationExecutor<Ticket> {

  Ticket queryTicketByTicketNumber(String ticketNumber);

  Ticket queryTicketByTicketNumberAndUploader(String ticketNumber,String uploder);

  /*查询未贴现的数据*/
  @Query(value = "select * from ticket " +
          "where 1=1 " +
          "and uploader=:uploader " +
          "and discount_status=:discountStatus " +
          "and (case when :firstDate!='' and :lastDate!='' then maturity_time between :firstDate and :lastDate " +
          "else maturity_time between (select now()) and (select date_add(now(),interval 1 month)) end )" +
          "order by maturity_time desc ",nativeQuery = true)
  List<Ticket> queryNoneDiscountTotalsByDate(@Param("discountStatus") String discountStatus, @Param("uploader") String uploader,
                                             @Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate);

}
