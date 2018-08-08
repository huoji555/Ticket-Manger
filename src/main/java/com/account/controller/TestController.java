package com.account.controller;

import com.account.service.IStudentService;
import com.account.util.JsonAnalyze;
import com.account.util.StatusMap;
import com.account.entity.student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * @Auther: Ragty
 * @Date: 2018/8/7 10:44
 * @Description:
 */
@RestController
@RequestMapping("/student")
public class TestController {

    @Autowired
    private JsonAnalyze jsonAnalyze;
    @Autowired
    private StatusMap statusMap;
    @Autowired
    private IStudentService studentService;


    @PostMapping("/save")
    @ResponseBody
    public String save(@RequestBody String requestJsonBody, HttpServletRequest request) throws Exception{

        Map<String,Object>  map = jsonAnalyze.json2Map(requestJsonBody);
        String test = String.valueOf(map.get("testData"));
        System.out.println(test);
        String ss = "sadadsadsadad";
        System.out.println("请求到后台数据了1"+test);

        student student =new student();
        student.setName(test);
        student.setPassword("123");

        studentService.save(student);

        return statusMap.a("1");

    }



}
