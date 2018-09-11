package com.account.repository;

import com.account.entity.Admin;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "admin")
public interface AdminRepository extends PagingAndSortingRepository<Admin,String> {

   Admin queryAdminByPhoneNumber(String phoneNumber);

   Admin queryAdminByPhoneNumberOrCompany(String phoneNumber,String Company);

   Admin queryAdminByPhoneNumberAndPassword(String phoneNumber,String password);

}
