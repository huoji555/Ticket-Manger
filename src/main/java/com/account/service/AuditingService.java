package com.account.service;

import com.account.entity.Auditing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditingService {

    void save(Auditing auditing);

    Auditing queryAuditingByPhone(String phone);

    void saveAndFlush(Auditing auditing);

    Page<Object[]> queryAuditingMessage(String phone, String status, Pageable pageable);

}
