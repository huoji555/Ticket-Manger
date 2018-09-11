package com.account.serviceImpl;

import com.account.entity.Auditing;
import com.account.repository.AuditingRepository;
import com.account.service.AuditingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditingServiceImpl implements AuditingService {

    @Autowired
    private AuditingRepository auditingRepository;

    //保存审核信息
    @Override
    public void save(Auditing auditing) { auditingRepository.save(auditing); }

    //根据电话号查询审核单
    @Override
    public Auditing queryAuditingByPhone(String phone) {
        Auditing auditing = new Auditing();
        auditing = auditingRepository.queryAuditingByPhone(phone);
        return auditing;
    }

    //相当于修改
    @Override
    public void saveAndFlush(Auditing auditing) {
        auditingRepository.saveAndFlush(auditing);
    }
}
