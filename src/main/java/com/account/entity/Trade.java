package com.account.entity;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "trade")
@DynamicInsert(true)
@DynamicUpdate(true)
public class Trade implements Serializable {

    private static final long serialVersionUID = 4322809880536158535L;

    private Integer id;
    private Date   date;
    private String tradeType;
    private String ticketType;
    private Float minRate;
    private Float maxRate;


    @Id
    @GeneratedValue(generator = "a_native")
    @GenericGenerator(name = "a_native",strategy = "native")
    @Column(name = "id")
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    @Column(name = "date",columnDefinition = "date")
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    @Column(name = "tradeType")
    public String getTradeType() { return tradeType; }
    public void setTradeType(String tradeType) { this.tradeType = tradeType; }

    @Column(name = "ticketType")
    public String getTicketType() { return ticketType; }
    public void setTicketType(String ticketType) { this.ticketType = ticketType; }

    @Column(name = "minRate")
    public Float getMinRate() { return minRate; }
    public void setMinRate(Float minRate) { this.minRate = minRate; }

    @Column(name = "maxRate")
    public Float getMaxRate() { return maxRate; }
    public void setMaxRate(Float maxRate) { this.maxRate = maxRate; }




}
