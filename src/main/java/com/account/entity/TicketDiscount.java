package com.account.entity;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "ticketDiscount")
@DynamicUpdate(true)
@DynamicInsert(true)
public class TicketDiscount implements Serializable {

    private static final long serialVersionUID = 7740409073182466562L;
    private Integer id;
    private String  discountParty;              //贴现方
    private String  discountPreice;             //贴现价格
    private String  discountAmount;             //贴现金额
    private String  commission;                 //手续费
    private Date    createDate;                 //创建日期
    private String  ticketNumber;               //票号
    private String  discountUploader;           //贴现者


    @Id
    @GeneratedValue(generator = "a_native")
    @GenericGenerator(name = "a_native",strategy = "native")
    @Column(name = "id")
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    @Column(name = "discountParty")
    public String getDiscountParty() { return discountParty; }
    public void setDiscountParty(String discountParty) { this.discountParty = discountParty; }

    @Column(name = "discountPreice")
    public String getDiscountPreice() { return discountPreice; }
    public void setDiscountPreice(String discountPreice) { this.discountPreice = discountPreice; }

    @Column(name = "discountAmount")
    public String getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(String discountAmount) { this.discountAmount = discountAmount; }

    @Column(name = "commission")
    public String getCommission() { return commission; }
    public void setCommission(String commission) { this.commission = commission; }

    @Column(name = "ticketNumber")
    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }

    @Column(name = "createDate")
    public Date getCreateDate() { return createDate; }
    public void setCreateDate(Date createDate) { this.createDate = createDate; }

    @Column(name = "discountUploader")
    public String getDiscountUploader() { return discountUploader; }
    public void setDiscountUploader(String discountUploader) { this.discountUploader = discountUploader; }

}
