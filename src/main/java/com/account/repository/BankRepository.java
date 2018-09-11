package com.account.repository;

import com.account.entity.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<Bank,String> {

    Bank queryBankByBankName(String bankName);

    Bank queryFirstByBankName(String bankName);

}
