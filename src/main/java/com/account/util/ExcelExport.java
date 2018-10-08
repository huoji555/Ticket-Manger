package com.account.util;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletResponse;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.net.URLEncoder;

@Component
public class ExcelExport {


    /**
     * @author Ragty
     * @param  导出为excel文件
     * @serialData 2018.9.28
     * @param fileName
     * @param sheetName
     * @param title
     * @param values
     * @param wb
     */
    public void excelExport(String sheetName, String title[], String values[][]) throws Exception{

        try {
            /*setResponseHeader(response,fileName);
            OutputStream os = response.getOutputStream();*/
            OutputStream os = new FileOutputStream("D:/student.xls");
            HSSFWorkbook wb = getWorkBook(sheetName, title, values);

            wb.write(os);
            os.write(wb.getBytes());
            os.flush();
            os.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


    /**
     * @author Ragty
     * @param  内容写入
     * @serialData 2018.9.28
     * @param sheetName
     * @param title
     * @param values
     * @param wb
     * @return
     */
    public static HSSFWorkbook getWorkBook(String sheetName, String title[], String values[][]) throws Exception{

        HSSFWorkbook wb = new HSSFWorkbook();

        HSSFSheet sheet = wb.createSheet(sheetName);

        HSSFRow row = sheet.createRow(0);

        //设置单元格样式(样式居中)
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);

        HSSFCell cell = null;

        //创建标题
        for (int i=0;i<title.length; i++) {
            cell = row.createCell(i);
            cell.setCellValue(title[i]);
            cell.setCellStyle(style);
        }

        //创建内容
        for (int i=0; i<values.length; i++) {
           row = sheet.createRow(i+1);
           for (int j=0; j<values[i].length; j++) {
               row.createCell(j).setCellValue(values[i][j]);
           }
        }

        return wb;
    }




    /**
     * @author Ragty
     * @param  发送响应流方法
     * @serialData  2018.9.28
     * @param response
     * @param fileName
     * @throws Exception
     */
    public static void setResponseHeader(HttpServletResponse response, String fileName) throws Exception{
        try {
            try {
                fileName = new String(fileName.getBytes(),"UTF-8");
            } catch (Exception e) {
                e.printStackTrace();
            }
            response.setContentType("application/octet-stream;application/vnd.ms-excel;charset=GB2312");
            response.setHeader("Content-Disposition", "attachment;filename="+ URLEncoder.encode(fileName,"UTF-8"));
            response.addHeader("Pargam", "no-cache");
            response.addHeader("Cache-Control", "no-cache");
            response.setCharacterEncoding("GB2312");
            /*response.setHeader("Cache-Control", "must-revalidate, post-check=0, pre-check=0");
            response.setHeader("Pragma", "public");
            response.setDateHeader("Expires", (System.currentTimeMillis() + 1000));*/
            //response.setContentType("application/vnd.ms-excel");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }



}
