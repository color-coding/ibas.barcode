package org.colorcoding.ibas.barcode.service.rest;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.colorcoding.ibas.barcode.repository.BORepositoryBarCode;
import org.colorcoding.ibas.bobas.common.OperationResult;

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
			@QueryParam("app") String app, @QueryParam("url") String url, @Context HttpServletRequest request) {
		return super.fetchWechatSignature(app, url, token);
	}
}
