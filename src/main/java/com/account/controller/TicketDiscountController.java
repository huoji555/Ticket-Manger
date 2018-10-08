package com.account.controller;

import com.account.entity.Ticket;
import com.account.entity.TicketDiscount;
import com.account.entity.Trade;
import com.account.repository.TicketRepository;
import com.account.service.TicketDiscountService;
import com.account.service.TicketService;
import com.account.service.TradeService;
import com.account.util.ExcelExport;
import com.account.util.ResultBean;
import com.google.common.collect.Maps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ticketDiscount")
public class TicketDiscountController {

    @Autowired
    private TicketService ticketService;
    @Autowired
    private TicketDiscountService ticketDiscountService;
    @Autowired
    private TradeService tradeService;
    @Autowired
    private ExcelExport excelExport;


    /**
     * @author  Ragty
     * @param  获取票据贴现页面的数据
     * @serialData  2018.8.28
     * @param ticketNumber
     * @return
     */
    @GetMapping("/getPage")
    public ResultBean<Page<Ticket>> show(@RequestParam Integer page,@RequestParam Integer size,
                                         HttpServletRequest request) throws Exception{

        HttpSession session = request.getSession();
        String adminId = String.valueOf(session.getAttribute("admin"));

        Page<Ticket> list = ticketService.pageList(page,size,adminId);
        return new ResultBean<Page<Ticket>>(list);
    }



    /**
     * @author Ragty
     * @param  获取贴现部分数据
     * @serialData 2018.8.28
     * @param ticketNumber
     * @return
     */
    @GetMapping("/getContent")
    public ResultBean<TicketDiscount> getContent(@RequestParam String ticketNumber,
                                                 HttpServletRequest request){

        HttpSession session = request.getSession();
        String adminId = String.valueOf(session.getAttribute("admin"));

        TicketDiscount ticketDiscount = new TicketDiscount();

        ticketDiscount = ticketDiscountService.queryTicketDiscountByTicketNumber(ticketNumber,adminId);

        return new ResultBean<TicketDiscount>(ticketDiscount);
    }



    /**
     * @author Ragty
     * @param  保存贴现数据
     * @serialData  2018.8.28
     * @param ticketDiscount
     * @return
     */
    @PostMapping("/save")
    public ResultBean<Map<String,Object>> save(@RequestBody TicketDiscount ticketDiscount,
                                               HttpServletRequest request){

        Map<String,Object> result = Maps.newHashMap();

        HttpSession session = request.getSession();
        String adminId = String.valueOf(session.getAttribute("admin"));

        Date date = new Date();
        TicketDiscount ticketDiscount1 = new TicketDiscount();

        ticketDiscount1.setCommission(ticketDiscount.getCommission());
        ticketDiscount1.setDiscountAmount(ticketDiscount.getDiscountAmount());
        ticketDiscount1.setDiscountParty(ticketDiscount.getDiscountParty());
        ticketDiscount1.setDiscountPreice(ticketDiscount.getDiscountPreice());
        ticketDiscount1.setTicketNumber(ticketDiscount.getTicketNumber());
        ticketDiscount1.setCreateDate(date);
        ticketDiscount1.setDiscountUploader(adminId);
        ticketDiscount1.setDiscountType(ticketDiscount.getDiscountType());

        ticketDiscountService.save(ticketDiscount1);

        Ticket ticket = ticketService.queryTicketByTicketNumberAndUploader(ticketDiscount.getTicketNumber(),adminId);

        ticket.setDiscountStatus("1");
        ticketService.save(ticket);

        return new ResultBean<Map<String,Object>>(result);
    }



    /**
     * @author Ragty
     * @param  获取财务汇总的信息
     * @serialData 2018.9.27
     * @param firstDate
     * @param lastDate
     * @return
     */
    @GetMapping("/queryFinance")
    public ResultBean<List<Object[]>> queryFinance(@RequestParam String firstDate,@RequestParam String lastDate,
                                                 HttpServletRequest request) throws Exception{

        HttpSession session = request.getSession();
        String uploader = String.valueOf(session.getAttribute("admin"));

        if (firstDate == "" || firstDate.equals("") ) { firstDate = null; }
        if ( lastDate == "" || lastDate.equals("") ) { lastDate = null; }

        List<Object[]> list = null;
        if ( firstDate == null || lastDate == null) {
           list = ticketDiscountService.queryDicountByDate(uploader,null,null);
        } else {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date firstDate1 = (Date) sdf.parse(firstDate);
            Date lastDate1 = (Date) sdf.parse(lastDate);
            list = ticketDiscountService.queryDicountByDate(uploader,firstDate1,lastDate1);
        }

        return new ResultBean<List<Object[]>>(list);

    }



    /**
     * @author  Ragty
     * @param   查询已贴现票据的信息
     * @serialData  2018.9.27
     * @param firstDate
     * @param lastDate
     * @param request
     * @return
     * @throws Exception
     */
    @GetMapping("/queryDiscount")
    public ResultBean<List<Object[]>> queryDiscount(@RequestParam String firstDate, @RequestParam String lastDate,
                                                  HttpServletRequest request) throws Exception{

        HttpSession session = request.getSession();
        String uploader = String.valueOf(session.getAttribute("admin"));

        if (firstDate == "" || firstDate.equals("") ) { firstDate = null; }
        if ( lastDate == "" || lastDate.equals("") ) { lastDate = null; }

        List<Object[]> list = null;
        if (firstDate == null || lastDate == null) {
            list = ticketDiscountService.queryDiscountTotalsByDate(uploader,null,null);
        } else {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date firstDate1 = (Date) sdf.parse(firstDate);
            Date lastDate1 = (Date) sdf.parse(lastDate);
            list = ticketDiscountService.queryDiscountTotalsByDate(uploader,firstDate1,lastDate1);
        }

        return new ResultBean<List<Object[]>>(list);
    }


    /**
     * @author  Ragty
     * @param  查询未贴现票据信息
     * @serialData  2018.9.27
     * @param firstDate
     * @param lastDate
     * @param request
     * @return
     * @throws Exception
     */
    @GetMapping("/queryNoneDiscount")
    public ResultBean<List<Ticket>> queryNoneDiscount(@RequestParam String firstDate, @RequestParam String lastDate,
                                                      HttpServletRequest request) throws Exception{

        HttpSession session = request.getSession();
        String uploader = String.valueOf(session.getAttribute("admin"));

        if (firstDate == "" || firstDate.equals("") ) { firstDate = null; }
        if ( lastDate == "" || lastDate.equals("") ) { lastDate = null; }

        List<Ticket> list = null;
        if (firstDate == null || lastDate == null) {
            list = ticketService.queryNoneDiscountTotalsByDate("0",uploader,null,null);
        } else {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date firstDate1 = (Date) sdf.parse(firstDate);
            Date lastDate1 = (Date) sdf.parse(lastDate);
            list = ticketService.queryNoneDiscountTotalsByDate("0",uploader,firstDate1,lastDate1);
        }


        return new ResultBean<List<Ticket>>(list);
    }



    /**
     * @author Ragty
     * @param  获取查看详细信息
     * @serialData 2018.9.27
     * @param ticketNumber
     * @param request
     * @return
     */
    @GetMapping("/getAllMessage")
    public ResultBean<Map<String,Object>> getAllMessage(@RequestParam String ticketNumber, HttpServletRequest request){

        Map<String,Object> result = Maps.newHashMap();
        HttpSession session = request.getSession();
        String uploader = String.valueOf(session.getAttribute("admin"));

        TicketDiscount ticketDiscount = new TicketDiscount();
        ticketDiscount = ticketDiscountService.queryTicketDiscountByTicketNumber(ticketNumber,uploader);

        Ticket ticket = ticketService.queryTicketByTicketNumberAndUploader(ticketNumber,uploader);

        result.put("ticketDiscount",ticketDiscount);
        result.put("ticket",ticket);

        return new ResultBean<Map<String,Object>>(result);
    }


}
