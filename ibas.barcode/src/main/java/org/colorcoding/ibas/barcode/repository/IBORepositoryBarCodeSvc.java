package org.colorcoding.ibas.barcode.repository;

import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.repository.IBORepositorySmartService;

/**
 * BarCode仓库服务
 */
public interface IBORepositoryBarCodeSvc extends IBORepositorySmartService {

	/**
	 * 获得微信签名,初始化微信JSSDK时使用
	 *
	 * @param appCode 应用编码
	 * @param url     当前网页的URL，不包含#及其后面部分
	 * @param token   口令
	 */
	OperationResult<String> fetchWechatSignature(String appCode, String url, String token);
}
