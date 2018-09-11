package com.account.repository;

import com.account.entity.Ticket;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "ticket")
public interface TicketRepository extends PagingAndSortingRepository<Ticket,String>, JpaSpecificationExecutor<Ticket> {

  Ticket queryTicketByTicketNumber(String ticketNumber);

}
