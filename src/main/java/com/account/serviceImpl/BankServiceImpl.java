package com.account.serviceImpl;

import com.account.entity.Bank;
import com.account.repository.BankRepository;
import com.account.service.BankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BankServiceImpl implements BankService {

    @Autowired
    private BankRepository bankRepository;

    @Override
    public Bank queryBankByName(String bankName) {
        return bankRepository.queryBankByBankName(bankName);
    }

    @Override
    public Bank queryFirstBank(String bankName) { return bankRepository.queryFirstByBankName(bankName); }
}
