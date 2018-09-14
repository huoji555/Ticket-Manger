package com.account.controller;

import com.account.entity.Admin;
import com.account.entity.Auditing;
import com.account.repository.AuditingRepository;
import com.account.service.AdminService;
import com.account.service.AuditingService;
import com.account.util.FileUpload;
import com.account.util.ResultBean;
import com.account.vo.BeSaveFileUitl;
import com.google.common.collect.Maps;
import org.apache.commons.collections.bag.SynchronizedSortedBag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.net.InetAddress;
import java.util.Map;

@RestController
@RequestMapping("/auditing")
public class AuditingController {


    @Autowired
    private AuditingService auditingService;
    @Autowired
    private AdminService adminService;
    @Autowired
    private FileUpload fileUpload;

    @Value("${upload.file.path}")
    private String filePath;

    @Value("${upload.file.spiltPath}")
    private String spiltPath;

    private final Logger logger = LoggerFactory.getLogger(AuditingController.class);


    /**
     * @author Ragty
     * @param 审核界面文件上传接口
     * @serialData 2018.8.13
     * @param file
     * @param bus
     * @param request
     * @return
     * @throws Exception
     */
    @PostMapping("/upload")
    @ResponseBody
    public Map<String,Object> upload(@RequestParam("file") MultipartFile file,
                                     @RequestParam("type") String type, HttpServletRequest request) throws Exception{
        Map<String,Object> result = Maps.newHashMap();

        HttpSession session = request.getSession();
        String adminId = String.valueOf(session.getAttribute("admin"));

        if (adminId.equals("null") || adminId == "null"){
            result.put("status",201);
            result.put("message","未登录，非法操作");
            return result;
        }

        String fileExtension = file
                .getOriginalFilename()
                .substring(file.getOriginalFilename().lastIndexOf(".") + 1,
                        file.getOriginalFilename().length()).toLowerCase();

        String fileType = "";
        byte[] newsPageByte = file.getBytes();
        String realPath = request.getSession().getServletContext()
                .getRealPath("/");


        //文件分类
        if ((fileExtension.equals("jpg")) || (fileExtension.equals("png"))
                || (fileExtension.equals("gif"))
                || (fileExtension.equals("jpeg"))) {
            fileType = "picture";
        } else if (fileExtension.equals("pdf")){
            fileType = "pdf";
        } else {
            result.put("status",202);
            result.put("message","不支持您上传的格式");
            return result;
        }
        System.out.println("-------------------");
        System.out.println(fileExtension);


        //上传分类器
        String fileURL = "";
        if ( type.equals("0") ) {
            fileURL = filePath +adminId+"/BussinessLicense";
        } else if ( type.equals("1") ) {
            fileURL = filePath +adminId+"/Constituation";
        } else if ( type.equals("2") ) {
            fileURL = filePath +adminId+"/OrganizationCode";
        } else if ( type.equals("3") ) {
            fileURL = filePath +adminId+"/IdCard";
        } else if ( type.equals("4") ) {
            fileURL = filePath +adminId+"/Authorization";
        }

        logger.info("上传前的路径"+fileURL.trim());

        // 存相对路径
        BeSaveFileUitl be = new BeSaveFileUitl();
        be.setFileExtension(fileExtension);
        be.setFilesByte(newsPageByte);
        be.setFileURL(fileURL.trim());

        String Url2 = "";
        String Url3 = "";
        String[] string = this.fileUpload.saveFile(be);

        //代表文件上传成功
        if ("1".equals(string[0])) {
            String URL = string[1];
            // 文件的真实路径，将之代替截图路径存入
            String url = URL.replaceAll("\\\\", "/") + "." + fileExtension;

            Url3 = url;
            Url2 = url.split(spiltPath)[1];   // 文件在服务器中的真实路径，用来删除
        }

        logger.info("上传后的路径"+Url2);
        System.out.println(Url2);
        System.out.println(Url3);

        //数据库相关操作
        Auditing auditing = auditingService.queryAuditingByPhone(adminId);

        if ( auditing == null ) {
            auditing = new Auditing();
            auditing.setPhone(adminId);
        }

        if ( type.equals("0") ) {

            if (auditing.getBusStatus() != null){
                File file1 = new File(auditing.getBusRealPath());
                file1.delete();
                System.out.println("删除成功");
            }
            auditing.setBussinessLicense(Url2);
            auditing.setBusRealPath(Url3);
            auditing.setBusStatus("0");
            auditing.setBusType(fileType);

        } else if ( type.equals("1") ) {

            if (auditing.getConStatus() != null){
                File file1 = new File(auditing.getConRealPath());
                file1.delete();
                System.out.println("删除成功");
            }
            auditing.setConstitution(Url2);
            auditing.setConRealPath(Url3);
            auditing.setConStatus("0");
            auditing.setConType(fileType);

        } else if ( type.equals("2") ) {

            if (auditing.getOrgStatus() != null){
                File file1 = new File(auditing.getOrgRealPath());
                file1.delete();
                System.out.println("删除成功");
            }
            auditing.setOrganizationCode(Url2);
            auditing.setOrgRealPath(Url3);
            auditing.setOrgStatus("0");
            auditing.setOrgType(fileType);

        } else if ( type.equals("3") ) {

            if (auditing.getIdCard() != null){
                File file1 = new File(auditing.getIdcRealPath());
                file1.delete();
                System.out.println("删除成功");
            }
            auditing.setIdCard(Url2);
            auditing.setIdcRealPath(Url3);
            auditing.setIdcStatus("0");
            auditing.setIdcType(fileType);

        } else if ( type.equals("4") ) {

            if (auditing.getAutStatus() != null){
                File file1 = new File(auditing.getAutRealPath());
                file1.delete();
                System.out.println("删除成功");
            }
            auditing.setAuthorization(Url2);
            auditing.setAutRealPath(Url3);
            auditing.setAutStatus("0");
            auditing.setAutType(fileType);

        }

        auditingService.saveAndFlush(auditing);

        result.put("status",200);
        result.put("message","上传成功");
        return result;
    }


    /**
     * @author Ragty
     * @param  检测审核状态
     * @serialData 2018.814
     * @param request
     * @return
     */
    @RequestMapping("feedback")
    @ResponseBody
    public Map<String,Object> feedback(HttpServletRequest request){
        Map<String,Object> result = Maps.newHashMap();
        Map<String,Object> list = Maps.newHashMap();

        HttpSession session = request.getSession();
        String adminId = String.valueOf(session.getAttribute("admin"));

        Auditing auditing = auditingService.queryAuditingByPhone(adminId);

        if( auditing == null ){
            list.put("busStatus","");
            list.put("conStatus","");
            list.put("orgStatus","");
            list.put("idcStatus","");
            list.put("autStatus","");
            result.put("status",201);
            result.put("message","您还未上传资料");
            result.put("list",list);
            return result;
        }

        String busStatus = auditing.getBusStatus();
        String conStatus = auditing.getConStatus();
        String orgStatus = auditing.getOrgStatus();
        String idcStatus = auditing.getIdcStatus();
        String autStatus = auditing.getAutStatus();

        list.put("busStatus",busStatus);
        list.put("conStatus",conStatus);
        list.put("orgStatus",orgStatus);
        list.put("idcStatus",idcStatus);
        list.put("autStatus",autStatus);

        if ( busStatus.equals("1") && conStatus.equals("1") && orgStatus.equals("1") && idcStatus.equals("1") && autStatus.equals("1") ){
            auditing.setStatus("1");
            auditingService.saveAndFlush(auditing);
            result.put("status",200);
            result.put("message","审核通过");
            return result;
        }

        result.put("status",201);
        result.put("message","审核中");
        result.put("list",list);
        return result;
    }


    /**
     * @author  Ragty
     * @param  获取用户信息
     * @serialData  2018.9.4
     * @param request
     * @return
     */
    @GetMapping("getAdminMessage")
    public ResultBean<Map<String,Object>> getAdminMessage(HttpServletRequest request) throws Exception{

        Map<String,Object> map = Maps.newHashMap();
        HttpSession session = request.getSession();
        String adminId = String.valueOf(session.getAttribute("admin"));

        Admin admin = adminService.queryAdminByPhone(adminId);
        Auditing auditing = auditingService.queryAuditingByPhone(adminId);

        map.put("adminId",admin.getPhoneNumber());
        map.put("company",admin.getCompany());
        map.put("authorization",auditing.getAuthorization());
        map.put("organizationCode",auditing.getOrganizationCode());
        map.put("constitution",auditing.getConstitution());
        map.put("bussinessLicense",auditing.getBussinessLicense());
        map.put("idCard",auditing.getIdCard());

        return new ResultBean<Map<String,Object>>(map);
    }


    //@GetMapping("getAuditing")



}
