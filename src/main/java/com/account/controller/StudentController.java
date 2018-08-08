package com.account.controller;

import com.account.service.IStudentService;
import com.account.entity.student;
import com.account.util.JsonAnalyze;
import com.account.util.StatusMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
public class StudentController {

    @Autowired
    private JsonAnalyze jsonAnalyze;
    @Autowired
    private IStudentService iStudentService;
    @Autowired
    private StatusMap statusMap;


    /**
     * @Author Ragty
     * @param requestJsonBody
     * @param request
     * @serialData 2018.8.7
     * @return
     */
    @RequestMapping("test.do")
    @ResponseBody
    public String test(@RequestBody String requestJsonBody, HttpServletRequest request) throws Exception{
        Map<String,Object> map = jsonAnalyze.json2Map(requestJsonBody);
        String test = String.valueOf(map.get("testData"));
        System.out.println(test);
        String ss = "sadadsadsadad";
        System.out.println("请求到后台数据了1"+test);

        student student =new student();
        student.setName(test);
        student.setPassword("123");


        iStudentService.save(student);

        return statusMap.a("1");
    }

}
