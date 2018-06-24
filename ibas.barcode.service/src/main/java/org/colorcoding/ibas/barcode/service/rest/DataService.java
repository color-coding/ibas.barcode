package org.colorcoding.ibas.barcode.service.rest;

import org.colorcoding.ibas.barcode.repository.BORepositoryBarCode;
import org.colorcoding.ibas.bobas.common.OperationResult;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

/**
 * BarCode 数据服务JSON
 */
@Path("data")
public class DataService extends BORepositoryBarCode {
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchWechatSignature")
	public OperationResult<String> fetchWechatSignature(@QueryParam("token") String token,
														@QueryParam("app") String app,
														@QueryParam("url") String url,
														@Context HttpServletRequest request) {
		return super.fetchWechatSignature(app, url, token);
	}
}
