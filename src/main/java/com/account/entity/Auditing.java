package com.account.entity;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * @Auther: Ragty
 * @Date: 2018/8/10 09:31
 * @Description:  审核表
 */
@Entity
@Table(name = "auditing")
@DynamicInsert(true)
@DynamicUpdate(true)
public class Auditing implements Serializable {

    private static final long serialVersionUID = -5675563997229569027L;
    private int id;
    private String bussinessLicense;           //企业营业执照
    private String busStatus;                  //企业营业执照审核状态(1代表审核通过，0代表审核中，为最初提交状态为，审核错误则为错误信息)
    private String busRealPath;                //真实路径(文件上传)
    private String busType;                    //文件类型
    private String constitution;               //公司章程
    private String conStatus;
    private String conRealPath;
    private String conType;
    private String organizationCode;          //组织机构代码证
    private String orgStatus;
    private String orgRealPath;
    private String orgType;
    private String idCard;                    //法人身份证
    private String idcStatus;
    private String idcRealPath;
    private String idcType;
    private String authorization;             //授权书
    private String autStatus;
    private String autRealPath;
    private String autType;
    private String status;                    //总的审核状态
    private String phone;                     //法人电话
    private Date   successDate;               //审核成功的日期



    @Id
    @GeneratedValue(generator = "a_native")
    @GenericGenerator(name = "a_native",strategy = "native")
    @Column(name = "id")
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    @Column(name = "bussinessLicense")
    public String getBussinessLicense() { return bussinessLicense; }
    public void setBussinessLicense(String bussinessLicense) { this.bussinessLicense = bussinessLicense; }

    @Column(name = "busStatus")
    public String getBusStatus() { return busStatus; }
    public void setBusStatus(String busStatus) { this.busStatus = busStatus; }

    @Column(name = "constitution")
    public String getConstitution() { return constitution; }
    public void setConstitution(String constitution) { this.constitution = constitution; }

    @Column(name = "conStatus")
    public String getConStatus() { return conStatus; }
    public void setConStatus(String conStatus) { this.conStatus = conStatus; }

    @Column(name = "organizationCode")
    public String getOrganizationCode() { return organizationCode; }
    public void setOrganizationCode(String organizationCode) { this.organizationCode = organizationCode; }

    @Column(name = "orgStatus")
    public String getOrgStatus() { return orgStatus; }
    public void setOrgStatus(String orgStatus) { this.orgStatus = orgStatus; }

    @Column(name = "idCard")
    public String getIdCard() { return idCard; }
    public void setIdCard(String idCard) { this.idCard = idCard; }

    @Column(name = "idcStatus")
    public String getIdcStatus() { return idcStatus; }
    public void setIdcStatus(String idcStatus) { this.idcStatus = idcStatus; }

    @Column(name = "authorization")
    public String getAuthorization() { return authorization; }
    public void setAuthorization(String authorization) { this.authorization = authorization; }

    @Column(name = "autStatus")
    public String getAutStatus() { return autStatus; }
    public void setAutStatus(String autStatus) { this.autStatus = autStatus; }

    @Column(name = "status")
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Column(name = "phone")
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    @Column(name = "busRealPath")
    public String getBusRealPath() { return busRealPath; }
    public void setBusRealPath(String busRealPath) { this.busRealPath = busRealPath; }

    @Column(name = "conRealPath")
    public String getConRealPath() { return conRealPath; }
    public void setConRealPath(String conRealPath) { this.conRealPath = conRealPath; }

    @Column(name = "orgRealPath")
    public String getOrgRealPath() { return orgRealPath; }
    public void setOrgRealPath(String orgRealPath) { this.orgRealPath = orgRealPath; }

    @Column(name = "idcRealPath")
    public String getIdcRealPath() { return idcRealPath; }
    public void setIdcRealPath(String idcRealPath) { this.idcRealPath = idcRealPath; }

    @Column(name = "autRealPath")
    public String getAutRealPath() { return autRealPath; }
    public void setAutRealPath(String autRealPath) { this.autRealPath = autRealPath; }

    @Column(name = "busType")
    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }

    @Column(name = "conType")
    public String getConType() { return conType; }
    public void setConType(String conType) { this.conType = conType; }

    @Column(name = "orgType")
    public String getOrgType() { return orgType; }
    public void setOrgType(String orgType) { this.orgType = orgType; }

    @Column(name = "idcType")
    public String getIdcType() { return idcType; }
    public void setIdcType(String idcType) { this.idcType = idcType; }

    @Column(name = "autType")
    public String getAutType() { return autType; }
    public void setAutType(String autType) { this.autType = autType; }

    @Column(name = "successDate")
    public Date getSuccessDate() { return successDate; }
    public void setSuccessDate(Date successDate) { this.successDate = successDate; }


}
