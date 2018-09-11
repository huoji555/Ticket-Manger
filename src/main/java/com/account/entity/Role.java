package com.account.entity;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "role")
@DynamicInsert(true)
@DynamicUpdate(true)
public class Role implements Serializable {

    private static final long serialVersionUID = -1487721453256145101L;
    private int id;
    private int roleId;                      //权限id
    private String roleName;                 //权限名称


    @Id
    @GeneratedValue(generator = "a_native")
    @GenericGenerator(name = "a_native",strategy = "native")
    @Column(name = "id")
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    @Column(name = "roleId")
    public int getRoleId() { return roleId; }
    public void setRoleId(int roleId) { this.roleId = roleId; }

    @Column(name = "roleName")
    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }

}
