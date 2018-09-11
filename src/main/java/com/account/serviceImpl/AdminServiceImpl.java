package com.account.serviceImpl;

import com.account.entity.Admin;
import com.account.repository.AdminRepository;
import com.account.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public void save(Admin admin) {
        adminRepository.save(admin);
    }


    //根据phone直接查询admin
    @Override
    public Admin queryAdminByPhone(String phoneNumber) { return adminRepository.queryAdminByPhoneNumber(phoneNumber); }

    @Override
    public Admin queryAdminByPhoneOrCompany(String phoneNumber, String company) {
        return adminRepository.queryAdminByPhoneNumberOrCompany(phoneNumber,company);
    }

    //根据电话号和密码对登录用户进行判断
    @Override
    public int hasMatchAdmin(String phoneNumber, String password) {
        int b = 0;
        Admin admin = new Admin();
        admin = adminRepository.queryAdminByPhoneNumber(phoneNumber);

        if (admin == null){
            return b = 0;      //0表示不存在该用户
        } else if (adminRepository.queryAdminByPhoneNumberAndPassword(phoneNumber,password) == null){
            return b = 2;      //2表示密码错误
        }

        return b = 1;          //1表示该用户可以登录
    }
}
