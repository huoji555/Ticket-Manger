package com.account.repository;

import com.account.entity.Auditing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "auditing")
public interface AuditingRepository extends JpaRepository<Auditing,String> {

    Auditing queryAuditingByPhone(String phone);

}
