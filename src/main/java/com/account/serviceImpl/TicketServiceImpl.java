package com.account.serviceImpl;

import com.account.entity.Ticket;
import com.account.repository.TicketRepository;
import com.account.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Override
    public void save(Ticket ticket) {
        ticketRepository.save(ticket);
    }

    @Override
    public Page<Ticket> pageList(Integer page, Integer size,String adminId) {
        PageRequest pageRequest = new PageRequest(page,size);
        Specification<Ticket> spec = new Specification<Ticket>() {
            @Override
            public Predicate toPredicate(Root<Ticket> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> list = new ArrayList<Predicate>();
                if (null!=adminId && !"".equals(adminId)&& !"undefined".equals(adminId)){
                    System.out.println("不为空0");
                    System.out.println(adminId);
                    list.add(cb.equal(root.get("uploader").as(String.class),adminId));
                }
                Predicate[] p = new Predicate[list.size()];
                return cb.and(list.toArray(p));
            }
        };
        return ticketRepository.findAll(spec,pageRequest);
    }

    @Override
    public Ticket queryTicketByNumber(String ticketNumber) {
        return ticketRepository.queryTicketByTicketNumber(ticketNumber);
    }

    @Override
    public Ticket queryTicketByTicketNumberAndUploader(String ticketNumber, String uploder) {
        return ticketRepository.queryTicketByTicketNumberAndUploader(ticketNumber,uploder);
    }

    @Override
    public Page<Ticket> queryTicket(Integer page,Integer size,String ticketNumber,String ticketName,String billerName,String uploader) {

        PageRequest pageRequest = new PageRequest(page,size);
        Specification<Ticket> spec = new Specification<Ticket>() {
            @Override
            public Predicate toPredicate(Root<Ticket> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
               List<Predicate> list = new ArrayList<Predicate>();
               if (null!=ticketNumber && !"".equals(ticketNumber)&& !"undefined".equals(ticketNumber)){
                   System.out.println("不为空0");
                   list.add(cb.equal(root.get("ticketNumber").as(String.class),ticketNumber));
               }
               if (null!=ticketName && !"".equals(ticketName)&& !"undefined".equals(ticketName)){
                   System.out.println("不为空1");
                   list.add(cb.equal(root.get("ticketName").as(String.class),ticketName));
               }
               if (null!=billerName && !"".equals(billerName)&& !"undefined".equals(billerName)){
                   System.out.println("不为空2");
                   list.add(cb.like(root.get("billerName").as(String.class),"%"+billerName+"%"));

               }
               if (null!=uploader && !"".equals(uploader)&& !"undefined".equals(uploader)){
                   System.out.println("不为空3");
                   list.add(cb.equal(root.get("uploader").as(String.class),uploader));
               }

               Predicate[] p = new Predicate[list.size()];
               return cb.and(list.toArray(p));
            }
        };

        return ticketRepository.findAll(spec,pageRequest);
    }

    @Override
    public List<Ticket> queryNoneDiscountTotalsByDate(String discountStatus, String uploader, Date firstDate, Date lastDate) {
        return ticketRepository.queryNoneDiscountTotalsByDate(discountStatus, uploader, firstDate, lastDate);
    }


}
