package com.account.entity;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "product")
@DynamicInsert(true)
@DynamicUpdate(true)
public class Product implements Serializable {

    private static final long serialVersionUID = -6961727874247826662L;

    private Integer id;
    private String  productId;
    private Float   yield;
    private Integer days;


    @Id
    @GeneratedValue(generator = "a_native")
    @GenericGenerator(name = "a_native",strategy = "native")
    @Column(name = "id")
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    @Column(name = "productId")
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    @Column(name = "yield")
    public Float getYield() { return yield; }
    public void setYield(Float yield) { this.yield = yield; }

    @Column(name = "days")
    public Integer getDays() { return days; }
    public void setDays(Integer days) { this.days = days; }



}
