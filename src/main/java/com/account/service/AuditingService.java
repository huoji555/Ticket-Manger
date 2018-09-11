package com.account.service;

import com.account.entity.Auditing;

public interface AuditingService {

    void save(Auditing auditing);

    Auditing queryAuditingByPhone(String phone);

    void saveAndFlush(Auditing auditing);

}
