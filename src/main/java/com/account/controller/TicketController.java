package com.account.controller;

import com.account.entity.Product;
import com.account.entity.Ticket;
import com.account.entity.Trade;
import com.account.repository.ProductRepository;
import com.account.repository.TradeRepository;
import com.account.service.BankService;
import com.account.service.ProductService;
import com.account.service.TicketService;
import com.account.service.TicketStatusService;
import com.account.util.*;
import com.account.vo.BeSaveFileUitl;
import com.account.vo.BeTrade;
import com.alibaba.fastjson.JSONArray;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.google.common.collect.Maps;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.WorkbookUtil;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.apache.tomcat.util.http.fileupload.disk.DiskFileItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.xml.stream.XMLOutputFactory;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/ticket")
public class TicketController {

    @Autowired
    private FileUpload fileUpload;
    @Autowired
    private ExcelResolve excelResolve;
    @Autowired
    private JsonAnalyze jsonAnalyze;
    @Autowired
    private CalculateTool calculateTool;
    @Autowired
    private TicketService ticketService;
    @Autowired
    private BankService bankService;
    @Autowired
    private TradeRepository tradeRepository;
    @Autowired
    private TicketStatusService ticketStatusService;
    @Autowired
    private ProductService productService;

    @Value("${upload.excel.path}")
    private String excelPath;



    /**
     * @author Ragty
     * @param  解析Excel文件接口
     * @serialData 2018.8.16
     * @param file
     * @param request
     * @return
     * @throws Exception
     */
    @PostMapping("upload")
    @ResponseBody
    public ResultBean<Map<String,Object>> upload(@RequestParam("file") MultipartFile file, HttpServletRequest request) throws Exception{

        Map<String,Object> result = Maps.newHashMap();

        HttpSession session = request.getSession();
        String adminId = String.valueOf(session.getAttribute("admin"));

        if (adminId.equals("null") || adminId == "null"){
            result.put("status",201);
            result.put("message","未登录，非法操作");
            return new ResultBean<Map<String,Object>>(result);
        }

        //文件上传
        byte[] newsPageByte = file.getBytes();
        String fileExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1,file.getOriginalFilename().length()).toLowerCase();
        String fileURL = excelPath;

        BeSaveFileUitl be = new BeSaveFileUitl();
        be.setFileExtension(fileExtension);
        be.setFilesByte(newsPageByte);
        be.setFileURL(fileURL.trim());

        //文件格式检查
        if (! ((fileExtension.equals("xls")) || (fileExtension.equals("xlsx")))  ) {
            result.put("status",202);
            result.put("message","不支持您上传的格式");
            return new ResultBean<Map<String,Object>>(result);
        }

        //代表文件上传成功
        String[] string = this.fileUpload.saveFile(be);
        String Url1 = "";
        if ("1".equals(string[0])) {
            String URL = string[1];
            Url1 = URL.replaceAll("\\\\", "/") + "." + fileExtension;
        }
        System.out.println("-------------------");
        System.out.println(Url1);
        System.out.println("-------------------");
        File fileAfter = new File(Url1);


        //数据解析部分（将每个单元格中的数据导出，并根据key值判断）
        JSONArray jsonArray = new JSONArray();

        try {
            jsonArray = excelResolve.readExcel(fileAfter);
        } catch (Exception e) {
            e.printStackTrace();
        }

        for (int i = 0; i<jsonArray.size(); i++){
            Map<String,Object> map = Maps.newHashMap();
            String json = jsonAnalyze.object2Json(jsonArray.get(i));
            map = jsonAnalyze.json2Map(json);

            Ticket ticket = new Ticket();
            ticket.setUploader(adminId);
            ticket.setDiscountStatus("0");           //代表未贴现

            for (Map.Entry<String,Object> entry : map.entrySet()){
                String head = entry.getKey().trim();
                String content = entry.getValue().toString().trim();
                ticket = filling(head,content,ticket,adminId);
            }


            ticketService.save(ticket);


        }

        if (fileAfter.exists()){
            System.out.println("存在");
            fileAfter.delete();
        }

        result.put("status",200);
        result.put("message","上传成功");
        return new ResultBean<Map<String,Object>>(result);
    }


    /**
     * @author Ragty
     * @param 票据信息采集
     * @serialData 2018.8.16
     * @param key
     * @param val
     * @param ticket
     * @return
     */
    public Ticket filling(String key,String val,Ticket ticket,String uploader) throws Exception{


        if (key == "票据号码" || key.equals("票据号码")){
            if (ticketService.queryTicketByTicketNumberAndUploader(val,uploader) != null) {
                //return ticket;
                ticket = ticketService.queryTicketByTicketNumberAndUploader(val,uploader);
            }
            ticket.setTicketNumber(val);
        } else if(key == "票面金额" || key.equals("票面金额")){
            Double db = Double.parseDouble(val);
            if (db.intValue()-db == 0){
                ticket.setTicketAmount(String.valueOf(db.intValue()));
            } else {
                ticket.setTicketAmount(val);
            }
        } else if(key == "票据类型" || key.equals("票据类型")){
            ticket.setTicketType(val);
        } else if(key == "票据名称" || key.equals("票据名称")){
            ticket.setTicketName(val);
        } else if(key == "不可转让标识" || key.equals("不可转让标识")){
            ticket.setNonTransferLogo(val);
        } else if(key == "不可转让标识名称" || key.equals("不可转让标识名称")){
            ticket.setNonTransferLogoName(val);
        } else if(key == "出票日期" || key.equals("出票日期")){
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            ticket.setTicketingTime(sdf.parse(val));
        } else if(key == "到期日期" || key.equals("到期日期")){
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            ticket.setMaturityTime(sdf.parse(val));
        } else if(key == "出票人名称" || key.equals("出票人名称")){
            ticket.setBillerName(val);
        } else if(key == "收票人名称" || key.equals("收票人名称")){
            ticket.setInvoiceName(val);
        } else if(key == "承兑人名称" || key.equals("承兑人名称")){
            String bankName = val.substring(0,val.indexOf("银"))+"银行";
            ticket.setAcceptorName(bankName);
        } else if(key == "票据状态" || key.equals("票据状态")){
            String statusName = ticketStatusService.queryTicketStatusByCode(val).getTicketStatusName();
            ticket.setTicketStatus(statusName);
        } else if(key == "下手持票人名称" || key.equals("下手持票人名称")){
            ticket.setHandheldName(val);
        } else if(key == "下手持票人账号" || key.equals("下手持票人账号")){
            ticket.setHandheldAccountNumber(val);
        } else if(key == "下手持票人行号" || key.equals("下手持票人行号")){
            ticket.setHandheldBankNumber(val);
        } else if(key == "本手持票人名称" || key.equals("本手持票人名称")){
            ticket.setOriginalHandheldName(val);
        } else if(key == "本手持票人行号" || key.equals("本手持票人行号")){
            ticket.setOriginalHandheldBankNumber(val);
        } else if(key == "在池状态" || key.equals("在池状态")){
            ticket.setPoolStatus(val);
        }

        return ticket;
    }


    /**
     * @author Ragty
     * @param 分页接口
     * @serialData 2018.8.17
     * @param page
     * @param size
     * @return
     */
    @GetMapping("getPage")
    public ResultBean<Page<Ticket>> getPage(@RequestParam Integer page,@RequestParam Integer size,
                                            HttpServletRequest request){
        HttpSession session = request.getSession();
        String adminId = String.valueOf(session.getAttribute("admin"));

        Page<Ticket> list = ticketService.pageList(page,size,adminId);
        return new ResultBean<Page<Ticket>>(list);
    }


    /**
     * @author Ragty
     * @param 分页查询
     * @serialData  2018.8.20
     * @param page
     * @param size
     * @param ticketNumber
     * @param ticketType
     * @param billerName
     * @return
     */
    @GetMapping("queryTicket")
    public ResultBean<Page<Ticket>> queryTicket(@RequestParam Integer page,@RequestParam Integer size,
                                                @RequestParam String ticketNumber,@RequestParam String ticketName,
                                                @RequestParam String billerName, HttpServletRequest request){
        Pageable pageable = new PageRequest(page,size);
        HttpSession session = request.getSession();
        String adminId = String.valueOf(session.getAttribute("admin"));

        Page<Ticket> list = ticketService.queryTicket(page,size,ticketNumber,ticketName,billerName,adminId);
        return new ResultBean<Page<Ticket>>(list);
    }


    /**
     * @author Ragty
     * @param  根据选择类型获取当前预估利率
     * @serialData 2018.8.21
     * @param currentDate
     * @param ticketNumber
     * @return
     */
    @GetMapping("calculate")
    public ResultBean<Map<String,Object>> calculate (@RequestParam String currentDate,
                                                     @RequestParam String ticketNumber)throws Exception{
        Map<String,Object> result = Maps.newHashMap();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date curentTime = sdf.parse(currentDate);

        Ticket ticket = ticketService.queryTicketByNumber(ticketNumber);

        long nd = 1000 * 24 * 60 * 60;
        long diff = ticket.getMaturityTime().getTime() - curentTime.getTime();
        long day = diff / nd;

        if (day <= 0){
            result.put("status",201);
            result.put("message","此张票据已过期");
            return new ResultBean<Map<String,Object>>(result);
        }

        List list = new ArrayList();
        list.add("贴现买断");
        list.add("贴现复查");
        list.add("质押");
        list.add("基准");

        //List<BeTrade> tradeList = new ArrayList<BeTrade>();
        List<Map<String,String>> tradeList = new ArrayList();

        for (int i=0; i<list.size(); i++){

            Trade trade = new Trade();
            Map<String,String> map = Maps.newHashMap();
            String tradeType = String.valueOf(list.get(i));
            map.put("tradeType",tradeType);

            if (tradeType.equals("基准")){
                trade = tradeRepository.queryTradeByDateAndTradeType(curentTime,tradeType);
            } else {
                String bankName = ticket.getAcceptorName();
                String ticketType = bankService.queryFirstBank(bankName).getBankType();
                trade = tradeRepository.queryTradeByDateAndTicketTypeAndTradeType(curentTime,ticketType,tradeType);
            }

            //先用假数据冒充贴现利率(需要当前日期，tradeType，type)
            Float minDiscountRate = trade.getMinRate();
            Float maxDiscountRate = trade.getMaxRate();
            Float ticketAmount= Float.parseFloat(ticket.getTicketAmount());

            //计算金额
            String min = calculateTool.calculateDiscount(day,minDiscountRate,ticketAmount);
            String max = calculateTool.calculateDiscount(day,maxDiscountRate,ticketAmount);

            //产品收益
            List<Product> productList = productService.getAll();
            for (int j=0; j<productList.size(); j++) {
                Long productDays = productList.get(j).getDays().longValue();
                Float yield = productList.get(j).getYield();
                String productId = productList.get(j).getProductId();

                String minIncome = calculateTool.productIncome(min,productDays,day,yield);
                String maxIncome = calculateTool.productIncome(max,productDays,day,yield);

                map.put("min"+productId.toString(),minIncome);
                map.put("max"+productId.toString(),maxIncome);
            }

            map.put("minRate",min+"");
            map.put("maxRate",max+"");
            tradeList.add(map);
        }

        for(int x = 0; x<tradeList.size(); x++){

            Map<String,String> map1 = tradeList.get(x);

            map1.forEach((key, value) -> {
                System.out.println(key + " "+value);
            });

        }

        result.put("status",200);
        result.put("message","计算成功");
        result.put("list",tradeList);
        return new ResultBean<Map<String,Object>>(result);

    }


}
