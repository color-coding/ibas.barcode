package org.colorcoding.ibas.barcode.repository;

import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.repository.IBORepositoryApplication;

/**
 * BarCode仓库应用
 */
public interface IBORepositoryBarCodeApp extends IBORepositoryApplication {

	// --------------------------------------------------------------------------------------------//

	/**
	 * 获得微信签名,初始化微信JSSDK时使用
	 *
	 * @param appCode 应用编码
	 * @param url     当前网页的URL，不包含#及其后面部分
	 */
	IOperationResult<String> fetchWechatSignature(String appCode, String url);
}
