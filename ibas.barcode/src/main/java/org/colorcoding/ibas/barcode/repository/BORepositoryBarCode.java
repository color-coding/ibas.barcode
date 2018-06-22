package org.colorcoding.ibas.barcode.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.message.Logger;
import org.colorcoding.ibas.bobas.message.MessageLevel;
import org.colorcoding.ibas.bobas.organization.OrganizationFactory;
import org.colorcoding.ibas.bobas.repository.BORepositoryServiceApplication;
import org.colorcoding.ibas.thirdpartyapp.bo.application.Application;
import org.colorcoding.ibas.thirdpartyapp.bo.application.IApplication;
import org.colorcoding.ibas.thirdpartyapp.repository.BORepositoryThirdPartyApp;

import javax.ws.rs.BadRequestException;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;
import java.security.MessageDigest;
import java.util.Formatter;
import java.util.Map;
import java.util.UUID;

/**
 * BarCode仓库
 */
public class BORepositoryBarCode extends BORepositoryServiceApplication
		implements IBORepositoryBarCodeSvc, IBORepositoryBarCodeApp {
	protected static final String MSG_CONNECTING_URL = "BORepositoryBarCode: open url [%s].";
	/**
	 * 地址模板-公众号AccessToken(区别于用户认证时得到的AccessToken)
	 */
	public static final String URL_TEMPLATE_ACCESSTOKEN = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s";

	/**
	 * 地址模板-初始化JsApi所需票据
	 */
	public final static String URL_TEMPLATE_JS_API_TICKET = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%s&type=jsapi";


	/**
	 * 获得微信签名,初始化微信JSSDK时使用
	 *
	 * @param appCode 应用编码
	 * @param url     当前网页的URL，不包含#及其后面部分
	 */
	@Override
	public IOperationResult<String> fetchWechatSignature(String appCode, String url) {
		return new OperationResult<String>(this.fetchWechatSignature(appCode, url, this.getUserToken()));
	}

	/**
	 * 获得微信签名,初始化微信JSSDK时使用
	 *
	 * @param appCode 应用编码
	 * @param url     当前网页的URL，不包含#及其后面部分
	 * @param token   口令
	 */
	@Override
	public OperationResult<String> fetchWechatSignature(String appCode, String url, String token) {
		OperationResult<String> opRslt = new OperationResult<String>();
		try {
			ICriteria criteria = new Criteria();
			ICondition condition = criteria.getConditions().create();
			condition.setAlias(Application.PROPERTY_CODE.getName());
			condition.setValue(appCode);
			condition = criteria.getConditions().create();
			condition.setAlias(Application.PROPERTY_ACTIVATED.getName());
			condition.setValue(emYesNo.YES);
			BORepositoryThirdPartyApp boRepository = new BORepositoryThirdPartyApp();
			boRepository.setUserToken(token);
			IOperationResult<IApplication> opRsltApp = boRepository.fetchApplication(criteria);
			IApplication application = opRsltApp.getResultObjects().firstOrDefault();
			if (application == null) {
				throw new Exception(I18N.prop("msg_tpa_invaild_application", appCode));
			}
			JsonNode result = this.generateWechatSignature(application.getAppId(), application.getAppSecret(), url);
			if (result.get("error") != null) {
				throw new Exception(this.nodeValue(result, "error"));
			}
			opRslt.addResultObjects(result.toString());
		} catch (Exception e) {
			opRslt.setError(e);
		}
		return opRslt;
	}


	// --------------------------------------------------------------------------------------------//
	public JsonNode generateWechatSignature(String appId, String appSecret, String url) throws Exception {
		JsonNodeFactory factory = JsonNodeFactory.instance;
		// 根节点
		ObjectNode rootNode = new ObjectNode(factory);
		try {
			// JsApi票据
			String ticket = this.getJsApiTicket(appId, appSecret);
			// 随机字符串
			String nonce_str = UUID.randomUUID().toString();
			// 时间戳
			String timestamp = Long.toString(System.currentTimeMillis() / 1000);
			String join_str;
			String signature = "";
			// 注意这里参数名必须全部小写，且必须有序
			join_str = String.format("jsapi_ticket=%s&noncestr=%s&timestamp=%s&url=%s", ticket, nonce_str, timestamp, url);
			MessageDigest crypt = MessageDigest.getInstance("SHA-1");
			crypt.reset();
			crypt.update(join_str.getBytes("UTF-8"));
			signature = byteToHex(crypt.digest());
			rootNode.put("url", url);
			//注意这里 要加上自己的appId
			rootNode.put("appId", appId);
			rootNode.put("jsapi_ticket", ticket);
			rootNode.put("nonceStr", nonce_str);
			rootNode.put("timestamp", timestamp);
			rootNode.put("signature", signature);
		} catch (Exception e) {
			rootNode.removeAll();
			rootNode.put("error", e.getMessage());
		}
		return rootNode;
	}

	protected String getJsApiTicket(String appId, String appSecret) throws Exception {
		// TODO:微信API调用次数有限,应先从缓存中取
		String url = String.format(URL_TEMPLATE_JS_API_TICKET, this.getAccesstoken(appId, appSecret));
		JsonNode data = this.doGet(url);
		if (data == null) {
			throw new BadRequestException(I18N.prop("msg_tpa_faild_ticket_request"));
		}
		JsonNode errNode = data.get("errmsg");
		if (errNode == null || !"ok".equalsIgnoreCase(this.nodeValue(data, "errmsg"))) {
			throw new BadRequestException(errNode.textValue());
		}
		JsonNode ticketNode = data.get("ticket");
		if (ticketNode != null) {
			return this.nodeValue(data, "ticket");
		} else {
			throw new BadRequestException(I18N.prop("msg_tpa_faild_ticket_request"));
		}
	}

	protected String getAccesstoken(String appId, String appSecret) throws Exception {
		// TODO:微信API调用次数有限,应先从缓存中取
		String url = String.format(URL_TEMPLATE_ACCESSTOKEN, appId, appSecret);
		JsonNode data = this.doGet(url);
		if (data == null) {
			throw new BadRequestException(I18N.prop("msg_tpa_faild_accesstoken_request"));
		}
		JsonNode errNode = data.get("errmsg");
		if (errNode != null) {
			throw new BadRequestException(errNode.textValue());
		}
		JsonNode accessTokenNode = data.get("access_token");
		if (accessTokenNode != null) {
			return this.nodeValue(data, "access_token");
		} else {
			throw new BadRequestException(I18N.prop("msg_tpa_faild_accesstoken_request"));
		}
	}

	protected String nodeValue(JsonNode data, String name) throws BadRequestException {
		JsonNode node = data.get(name);
		if (node == null) {
			throw new BadRequestException(I18N.prop("msg_tpa_no_return_value", name));
		}
		return node.textValue();
	}

	protected JsonNode doGet(String url) throws IOException {
		Logger.log(MessageLevel.DEBUG, MSG_CONNECTING_URL, url);
		URL realUrl = new URL(url);
		// 打开和URL之间的连接
		URLConnection connection = realUrl.openConnection();
		// 设置通用的请求属性
		connection.setRequestProperty("accept", "*/*");
		connection.setRequestProperty("connection", "Keep-Alive");
		connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
		// 建立实际的连接
		connection.connect();
		return new ObjectMapper().readTree(connection.getInputStream());
	}

	protected String byteToHex(final byte[] hash) {
		Formatter formatter = new Formatter();
		for (byte b : hash) {
			formatter.format("%02x", b);
		}
		String result = formatter.toString();
		formatter.close();
		return result;
	}
}
