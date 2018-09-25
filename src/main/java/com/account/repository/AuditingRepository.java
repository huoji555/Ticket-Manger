package com.account.repository;

import com.account.entity.Auditing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(path = "auditing")
public interface AuditingRepository extends JpaRepository<Auditing,String> {

    Auditing queryAuditingByPhone(String phone);


    @Query( value = "SELECT adm.phone_number,adm.company,adm.create_time,adm.create_ip,aud.status FROM member adm " +
                    "LEFT JOIN auditing aud on adm.phone_number=aud.phone " +
                    "where 1=1 "+
                    "and (case when :phone !='' then adm.phone_number=:phone else 1=1 end)"+
                    "and (case when :status ='2' then aud.status is null when :status != '' then aud.status=:status else 1=1 end )"+
                    "and (case when :company != '' then adm.company like CONCAT('%',:company,'%') else 1=1 end)"+
                    "order by ?#{#pageable}",
            countQuery = "select count(*)" +
                    "FROM member adm LEFT JOIN auditing aud on adm.phone_number=aud.phone "+
                    "where 1=1 " +
                    "and (case when :phone !='' then adm.phone_number=:phone else 1=1 end)"+
                    "and (case when :status ='2' then aud.status is null when :status != '' then aud.status=:status else 1=1 end )"+
                    "and (case when :company != '' then adm.company like CONCAT('%',:company,'%') else 1=1 end )",
            nativeQuery = true)
    Page<Object[]> queryAuditingMessage(@Param("phone") String phone, @Param("status") String status,@Param("company") String company, Pageable pageable);

}
