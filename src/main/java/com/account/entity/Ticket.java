package com.account.entity;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "ticket")
@DynamicInsert(true)
@DynamicUpdate(true)
public class Ticket implements Serializable {

    private static final long serialVersionUID = 4993294479627601629L;

    private int id;
    private String ticketNumber;                  //票据号码
    private String ticketAmount;                  //票面金额
    private String ticketType;                    //票据类型
    private String ticketName;                    //票据名称
    private String nonTransferLogo;               //不可转让标识
    private String nonTransferLogoName;           //不可转让标识名称
    private Date   ticketingTime;                 //出票时间
    private Date   maturityTime;                  //到期时间
    private String billerName;                    //出票人名称
    private String invoiceName;                   //收票人名称
    private String acceptorName;                  //承兑人名称
    private String ticketStatus;                  //票据状态
    private String handheldName;                  //下手持票人名称
    private String handheldAccountNumber;         //下手持票人账号
    private String handheldBankNumber;            //下手持票人行号
    private String originalHandheldName;          //本手持票人名称
    private String originalHandheldBankNumber;    //本手持票人行号
    private String poolStatus;                    //在池状态
    private String uploader;                      //票据上传者
    private String discountStatus;                //贴现状态



    @Id
    @GeneratedValue(generator = "a_native")
    @GenericGenerator(name = "a_native",strategy = "native")
    @Column(name = "id")
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    @Column(name = "ticketNumber")
    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }

    @Column(name = "ticketAmount")
    public String getTicketAmount() { return ticketAmount; }
    public void setTicketAmount(String ticketAmount) { this.ticketAmount = ticketAmount; }

    @Column(name = "ticketType")
    public String getTicketType() { return ticketType; }
    public void setTicketType(String ticketType) { this.ticketType = ticketType; }

    @Column(name = "ticketName")
    public String getTicketName() { return ticketName; }
    public void setTicketName(String ticketName) { this.ticketName = ticketName; }

    @Column(name = "nonTransferLogo")
    public String getNonTransferLogo() { return nonTransferLogo; }
    public void setNonTransferLogo(String nonTransferLogo) { this.nonTransferLogo = nonTransferLogo; }

    @Column(name = "nonTransferLogoName")
    public String getNonTransferLogoName() { return nonTransferLogoName; }
    public void setNonTransferLogoName(String nonTransferLogoName) { this.nonTransferLogoName = nonTransferLogoName; }

    @Column(name = "ticketingTime",columnDefinition = "date")
    public Date getTicketingTime() { return ticketingTime; }
    public void setTicketingTime(Date ticketingTime) { this.ticketingTime = ticketingTime; }

    @Column(name = "maturityTime",columnDefinition = "date")
    public Date getMaturityTime() { return maturityTime; }
    public void setMaturityTime(Date maturityTime) { this.maturityTime = maturityTime; }

    @Column(name = "billerName")
    public String getBillerName() { return billerName; }
    public void setBillerName(String billerName) { this.billerName = billerName; }

    @Column(name = "invoiceName")
    public String getInvoiceName() { return invoiceName; }
    public void setInvoiceName(String invoiceName) { this.invoiceName = invoiceName; }

    @Column(name = "acceptorName")
    public String getAcceptorName() { return acceptorName; }
    public void setAcceptorName(String acceptorName) { this.acceptorName = acceptorName; }

    @Column(name = "ticketStatus")
    public String getTicketStatus() { return ticketStatus; }
    public void setTicketStatus(String ticketStatus) { this.ticketStatus = ticketStatus; }

    @Column(name = "handheldName")
    public String getHandheldName() { return handheldName; }
    public void setHandheldName(String handheldName) { this.handheldName = handheldName; }

    @Column(name = "handheldAccountNumber")
    public String getHandheldAccountNumber() { return handheldAccountNumber; }
    public void setHandheldAccountNumber(String handheldAccountNumber) { this.handheldAccountNumber = handheldAccountNumber; }

    @Column(name = "handheldBankNumber")
    public String getHandheldBankNumber() { return handheldBankNumber; }
    public void setHandheldBankNumber(String handheldBankNumber) { this.handheldBankNumber = handheldBankNumber; }

    @Column(name = "originalHandheldName")
    public String getOriginalHandheldName() { return originalHandheldName; }
    public void setOriginalHandheldName(String originalHandheldName) { this.originalHandheldName = originalHandheldName; }

    @Column(name = "originalHandheldBankNumber")
    public String getOriginalHandheldBankNumber() { return originalHandheldBankNumber; }
    public void setOriginalHandheldBankNumber(String originalHandheldBankNumber) { this.originalHandheldBankNumber = originalHandheldBankNumber; }

    @Column(name = "poolStatus")
    public String getPoolStatus() { return poolStatus; }
    public void setPoolStatus(String poolStatus) { this.poolStatus = poolStatus; }

    @Column(name = "uploader")
    public String getUploader() { return uploader; }
    public void setUploader(String uploader) { this.uploader = uploader; }

    @Column(name = "discountStatus")
    public String getDiscountStatus() { return discountStatus; }
    public void setDiscountStatus(String discountStatus) { this.discountStatus = discountStatus; }

}
