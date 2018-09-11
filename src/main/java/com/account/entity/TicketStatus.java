package com.account.entity;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "ticketStatus")
@DynamicInsert(true)
@DynamicUpdate(true)
public class TicketStatus implements Serializable {

    private static final long serialVersionUID = -9019984563308337625L;
    private Integer id;
    private String ticketStatusCode;
    private String ticketStatusName;


    @Id
    @GeneratedValue(generator = "a_native")
    @GenericGenerator(name = "a_native",strategy = "native")
    @Column(name = "id")
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    @Column(name = "ticketStatusCode")
    public String getTicketStatusCode() { return ticketStatusCode; }
    public void setTicketStatusCode(String ticketStatusCode) { this.ticketStatusCode = ticketStatusCode; }

    @Column(name = "ticketStatusName")
    public String getTicketStatusName() { return ticketStatusName; }
    public void setTicketStatusName(String ticketStatusName) { this.ticketStatusName = ticketStatusName; }

}
