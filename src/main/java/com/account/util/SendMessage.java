package com.account.util;

import okhttp3.FormBody;
import okhttp3.RequestBody;
import org.springframework.stereotype.Component;

/**
 * @author Ragty
 * @param  发送短信接口
 * @serialDate 2018.9.7
 */
@Component
public class SendMessage {


    public static String sendQmx(String mobile, String content) throws Exception {
        String account = "N4296879";
        String pwd = "7Ge96PbD1oe0c9";
        String baseUrl="https://sms.253.com/msg/HttpBatchSendSM";

        RequestBody body = new FormBody.Builder()
                .add("account", account)
                .add("pswd", pwd)
                .add("needstatus", "1")

                .add("mobile", mobile)
                .add("msg",content)
                .build();

        String json = OkhttpUtil.post(baseUrl, body);
        System.out.println("运行完毕");
        return json;
    }


}
