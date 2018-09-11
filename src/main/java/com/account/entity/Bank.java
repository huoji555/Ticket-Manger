package com.account.entity;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "bank")
@DynamicInsert(true)
@DynamicUpdate(true)
public class Bank implements Serializable {

    private static final long serialVersionUID = -4062230487489917649L;

    private Integer id;
    private String bankType;
    private String bankName;

    @Id
    @GeneratedValue(generator = "a_native")
    @GenericGenerator(name = "a_native",strategy = "native")
    @Column(name = "id")
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    @Column(name = "bankType")
    public String getBankType() { return bankType; }
    public void setBankType(String bankType) { this.bankType = bankType; }

    @Column(name = "bankName")
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

}
