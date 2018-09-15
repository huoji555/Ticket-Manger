package com.account.serviceImpl;

import com.account.entity.Auditing;
import com.account.repository.AuditingRepository;
import com.account.service.AuditingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

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

    //查询审核信息分页
    @Override
    public Page<Object[]> queryAuditingMessage(String phone, String status, Pageable pageable) {
        return auditingRepository.queryAuditingMessage(phone,status,pageable);
    }
}
