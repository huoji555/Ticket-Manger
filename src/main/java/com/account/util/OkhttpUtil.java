package com.xingyoucai.smartloan.util;

import com.alibaba.fastjson.JSON;
import com.xingyoucai.smartloan.entity.Ticket;
import com.xingyoucai.smartloan.model.ApiModel;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.apache.commons.lang.StringUtils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.net.URLEncoder;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * @author lierlei@xingyoucai.com
 * @create 2017-11-15 10:36
 **/
public class OkhttpUtil {
	private static OkHttpClient client = null;

	private static OkHttpClient getClient() {
		if(client == null){
			final okhttp3.OkHttpClient.Builder httpBuilder = new OkHttpClient.Builder();
			client = httpBuilder
					.connectTimeout(60, TimeUnit.SECONDS)
					.writeTimeout(60, TimeUnit.SECONDS)
					.readTimeout(60,TimeUnit.SECONDS)
					.build(); //设置超时
		}

		return client;
	}

	public static Object call(String url,String params) throws Exception{

		RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"),
				URLEncoder.encode(params, "UTF-8"));
		Request request = new Request.Builder()
								.post(body)
								.url(url)
								.build();
		OkHttpClient client = getClient();
		Response response = client.newCall(request).execute();

		if (response.isSuccessful()) {
			String result = response.body().string();//响应
			return validResponse(result);
		}
		return "error";
	}

	private static Object validResponse(String result) throws Exception{
		ApiModel model = JSON.parseObject(result, ApiModel.class);

		if(model.sigValidate()){
			return model.getBody();
		}
		return "error";
	}

	public static String get(String url) throws IOException {
		String result= getClient().newCall(new Request.Builder().url(url).get().build())
					.execute()
					.body()
					.string();
		return result;
	}

	public static String post(String url,RequestBody body) throws Exception{
		String result =getClient().newCall(new Request.Builder().url(url).post(body).build()).execute().body().string();
		return result;
	}

	public static String post2(String url,RequestBody body) throws IOException{
		String result =getClient().newBuilder().readTimeout(60000, TimeUnit.MILLISECONDS).build().newCall(new Request.Builder().url(url).post(body).build()).execute().body().string();
		return result;
	}

	public static String post(String url,String token,String params) throws IOException{
		RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"),
								URLEncoder.encode(params, "UTF-8"));
		Request.Builder builder = new Request.Builder();
		if(StringUtils.isNotBlank(token)){
			builder.addHeader("Authorization",token);
		}
		Response response = getClient().newCall(builder.url(url).post(body).build()).execute();
		if(response.isSuccessful()){
			return response.body().string();
		}
		return null;
	}

	public static String get(String url,String token) throws Exception {
		Request build = new Request.Builder().addHeader("Authorization", token).url(url).get().build();
		Response response = getClient().newCall(build).execute();
		if(response.isSuccessful()){
			return response.body().string();
		}
		return null;
	}
}
