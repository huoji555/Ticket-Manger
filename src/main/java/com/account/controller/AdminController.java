package com.account.controller;

import ch.qos.logback.core.joran.util.StringToObjectConverter;
import com.account.entity.Admin;
import com.account.service.AdminService;
import com.account.util.*;
import com.google.common.collect.Maps;
import org.apache.commons.collections.bag.SynchronizedSortedBag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private JsonAnalyze jsonAnalyze;
    @Autowired
    private StatusMap statusMap;
    @Autowired
    private MD5Util md5Util;
    @Autowired
    private SendMessage sendMessage;

    public String verifyCode = "";

    /**
     * @author Ragty
     * @param 注册接口
     * @serialData  2018.8.8
     * @param requestJosnBody
     * @param request
     * @return
     * @throws IOException
     */
    @PostMapping("register")
    @ResponseBody
    public Map<String,Object> register(@RequestBody String requestJosnBody, HttpServletRequest request) throws IOException {
        Map<String,Object> result = Maps.newHashMap();
        Map<String,Object> map = jsonAnalyze.json2Map(requestJosnBody);
        String phoneNumber = String.valueOf(map.get("phone"));
        String password = String.valueOf(map.get("password"));
        String company = String.valueOf(map.get("company"));
        String verifyCodeFront = String.valueOf(map.get("verfiyCode"));

        //验证码暂且不提,判断前台返回的验证码和手机生成的验证码是否相同
        if(!verifyCodeFront.equals(verifyCode)){
            result.put("status",201);
            result.put("message","验证码不正确");
            return result;
        }


        //判断该用户是否已经注册过
        Admin admin = new Admin();
        admin = adminService.queryAdminByPhoneOrCompany(phoneNumber,company);

        if(admin != null){
            result.put("status",201);
            result.put("message","该用户名(公司名)已被使用");
            return result;
        }

        Admin admin1 = new Admin();
        Date date = new Date();
        String ip = "";

        try {
           ip = getClientIp(request);
        }catch (Exception e){
            e.printStackTrace();
        }


        admin1.setPhoneNumber(phoneNumber);
        admin1.setPassword(md5Util.digest(password));
        admin1.setCompany(company);
        admin1.setRoleId(2);
        admin1.setCreateTime(date);
        admin1.setCreateIp(ip);

        adminService.save(admin1);

        HttpSession session = request.getSession();
        session.setAttribute("admin",phoneNumber);
        session.setMaxInactiveInterval(6*60*60);

        result.put("status",200);
        result.put("message","注册成功");
        verifyCode = "";                        //将验证码再次置空，防止重复利用一个验证码
        return result;
    }


    /**
     * @author Ragty
     * @param  短信请求接口（注册）
     * @serialData  2018.8.9
     * @param requestJsonBody
     * @return
     */
    @RequestMapping("/verifyCode")
    @ResponseBody
    public Map<String,Object> verifyCode(@RequestBody String requestJsonBody) throws Exception{
        Map<String,Object> result = Maps.newHashMap();
        Map<String,Object> map = jsonAnalyze.json2Map(requestJsonBody);
        String phoneNmber = String.valueOf(map.get("phone"));

        verifyCode = createCode();
        System.out.println(verifyCode);
        System.out.println(phoneNmber);

        sendMessage.sendQmx(phoneNmber,"【星河保理】 您的验证码"+verifyCode);

        System.out.println("执行过了");

        result.put("status",200);
        result.put("message","请求成功,验证码是"+verifyCode);
        return result;
    }

    //生成验证码
    public static String createCode(){
        Random random = new Random();
        String result="";
        for (int i=0;i<6;i++)
        {
            result += random.nextInt(10);
        }
        return result;
    }


    /**
     * @author Ragty
     * @param  登录接口
     * @serialData  201.8.9
     * @param admin
     * @return
     */
    @PostMapping("/login")
    @ResponseBody
    public Map<String,Object> login(@RequestBody Admin admin,HttpServletRequest request){
        Map<String,Object> result = Maps.newHashMap();
        String phone = admin.getPhoneNumber();
        String password = md5Util.digest(admin.getPassword());

        int a = 0;
        a = adminService.hasMatchAdmin(phone,password);

        if(a == 0){
            result.put("status",201);
            result.put("message","用户不存在");
            return result;
        } else if (a == 2) {
            result.put("status",201);
            result.put("message","用户名或密码错误");
            return result;
        }

        HttpSession session = request.getSession();
        session.setAttribute("admin",phone);
        session.setMaxInactiveInterval(6*60*60);

        int roleId = adminService.queryAdminByPhone(phone).getRoleId();

        result.put("status",200);
        result.put("message","登录成功");      //登录成功后，需要判断他的权限（同时加个session）
        result.put("roleId",roleId);

        return result;

    }


    /**
     * @author Ragty
     * @param  退出接口
     * @serialData  2018.8.9
     * @param request
     * @return
     */
    @PostMapping("/logOut")
    @ResponseBody
    public Map<String,Object> logOut(HttpServletRequest request){
       Map<String,Object> result = Maps.newHashMap();
       HttpSession session = request.getSession();
       session.invalidate();

       result.put("status",200);
       result.put("message","退出成功");
       return result;

    }


    /**
     * @author Ragty
     * @param  判断用户是否登录
     * @serialData  2018.9.1
     * @param request
     * @return
     */
    @PostMapping("ifLogin")
    public Map<String,Object> ifLogin(HttpServletRequest request){
        Map<String,Object> result = Maps.newHashMap();
        HttpSession session = request.getSession();

        String adminId = String.valueOf(session.getAttribute("admin"));
        String roleId = String.valueOf(adminService.queryAdminByPhone(adminId).getRoleId());

        if (adminId.equals("null") || adminId == "null"){
            result.put("status",201);
            result.put("roleId","");
            result.put("message","未登录，非法操作");
            return result;
        }

        result.put("status",200);
        result.put("roleId",roleId);
        result.put("message","已登录");
        return result;
    }


    /**
     * @author Ragty
     * @param  获取客户端IP
     * @serialData 2018.9.10
     * @return
     */
    public String getClientIp(HttpServletRequest request) throws Exception{

        String ip = request.getHeader("x-forwarded-for");
        if ((ip == null) || (ip.length() == 0)
                || ("unknown".equalsIgnoreCase(ip))) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if ((ip == null) || (ip.length() == 0)
                || ("unknown".equalsIgnoreCase(ip))) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if ((ip == null) || (ip.length() == 0)
                || ("unknown".equalsIgnoreCase(ip))) {
            ip = request.getRemoteAddr();
            if (ip.equals("127.0.0.1")) {
                InetAddress inet = null;
                try {
                    inet = InetAddress.getLocalHost();
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
                ip = inet.getHostAddress();
            }
        }

        return ip;
    }


    /**
     * @author Ragty
     * @param  修改密码接口
     * @param newPwd
     * @param request
     * @serialData 2018.9.10
     * @return
     */
    @GetMapping(value = "updatePwd")
    public Map<String,Object> updatePwd(@RequestParam String orignalPwd, @RequestParam String newPwd,HttpServletRequest request) {

        Map<String,Object> result = Maps.newHashMap();
        HttpSession session = request.getSession();

        String adminId = String.valueOf(session.getAttribute("admin"));
        Admin admin = new Admin();
        admin = adminService.queryAdminByPhone(adminId);
        String ip = "";
        int a = 0;
        a = adminService.hasMatchAdmin(adminId,md5Util.digest(orignalPwd));

        if (a == 2) {
            result.put("status",201);
            result.put("message","原密码不正确");
            return result;
        }

        try {
            ip = getClientIp(request);
        }catch (Exception e){
            e.printStackTrace();
        }

        admin.setPassword(md5Util.digest(newPwd.trim()));
        admin.setUpdateTime(new Date());
        admin.setUpdateIp(ip);

        adminService.save(admin);

        result.put("status",200);
        result.put("message","修改成功");
        return result;

    }

}
