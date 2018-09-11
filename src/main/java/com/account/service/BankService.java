package com.account.service;

import com.account.entity.Bank;

public interface BankService {

    Bank queryBankByName(String bankName);

    Bank queryFirstBank(String bankName);

}
