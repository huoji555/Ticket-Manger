package com.account.entity;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * @Auther: Ragty
 * @Date: 2018/8/8 10:28
 * @Description: 用户表
 */
@Entity
@Table(name="member")
@DynamicInsert(true)
@DynamicUpdate(true)
public class Admin implements Serializable {

    private static final long serialVersionUID = 1088577565835040748L;
    private int id;
    private String phoneNumber;                      //注册的手机号
    private String password;                         //注册的密码
    private String company;                          //公司名称
    private int roleId;                              //权限id(默认为2)
    private Date createTime;                         //创建日期
    private Date updateTime;                         //修改日期
    private String createIp;                         //创建者ip
    private String updateIp;                         //修改者ip



    @Id
    @GeneratedValue(generator = "a_native")
    @GenericGenerator(name = "a_native",strategy = "native")
    @Column(name = "id")
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    @Column(name = "phone_number")
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }


    @Column(name = "password")
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    @Column(name = "company")
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    @Column(name = "role_id")
    public int getRoleId() { return roleId; }
    public void setRoleId(int roleId) { this.roleId = roleId; }

    @Column(name = "createTime")
    public Date getCreateTime() { return createTime; }
    public void setCreateTime(Date createTime) { this.createTime = createTime; }

    @Column(name = "updateTime")
    public Date getUpdateTime() { return updateTime; }
    public void setUpdateTime(Date updateTime) { this.updateTime = updateTime; }

    @Column(name = "createIp")
    public String getCreateIp() { return createIp; }
    public void setCreateIp(String createIp) { this.createIp = createIp; }

    @Column(name = "updateIp")
    public String getUpdateIp() { return updateIp; }
    public void setUpdateIp(String updateIp) { this.updateIp = updateIp; }


}
