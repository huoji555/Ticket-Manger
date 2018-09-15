package com.account.service;

import com.account.entity.Admin;
import org.springframework.data.domain.Page;


public interface AdminService {

    void save(Admin admin);

    Admin queryAdminByPhone(String phoneNumber);

    Admin queryAdminByPhoneOrCompany(String phoneNumber,String company);

    int hasMatchAdmin(String phoneNumber,String password);

}
