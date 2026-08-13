package org.colorcoding.ibas.barcode.service.rest;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import java.util.function.BiConsumer;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

import org.colorcoding.ibas.barcode.MyConfiguration;
import org.colorcoding.ibas.barcode.data.DataConvert;
import org.colorcoding.ibas.barcode.utils.ZXingCodeUtils;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.file.FileItem;
import org.colorcoding.ibas.bobas.message.Logger;
import org.colorcoding.ibas.bobas.repository.jersey.FileRepositoryService;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

@Path("file")
public class FileService extends FileRepositoryService {
	/**
	 * 一维条码的标记
	 */
	public final static String BARCODE_SIGN = "1";

	public FileService() {
		// 设置文件仓库位置
		this.setRepositoryFolder("barcode_files");
		// 设置是否分组存储文件
		this.setGroupingFiles(
				MyConfiguration.getConfigValue(MyConfiguration.CONFIG_ITEM_FILE_REPOSITORY_GROUPING_FILES, true));
	}

	@POST
	@Path("upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public OperationResult<FileItem> upload(FormDataMultiPart formData,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.save(formData.getField("file"), MyConfiguration.optToken(authorization, token));
	}

	@POST
	@Path("download")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public void download(Criteria criteria, @HeaderParam("authorization") String authorization,
			@QueryParam("token") String token, @Context HttpServletResponse response) {
		try {
			// 获取文件
			IOperationResult<FileItem> operationResult = this.fetch(criteria,
					MyConfiguration.optToken(authorization, token));
			if (operationResult.getError() != null) {
				throw operationResult.getError();
			}
			FileItem fileItem = operationResult.getResultObjects().firstOrDefault();
			if (fileItem != null) {
				// 设置文件名
				response.setHeader("Content-Disposition", String.format("attachment;filename=%s", fileItem.getName()));
				// 设置内容类型
				response.setContentType(MediaType.APPLICATION_OCTET_STREAM);
				// 写入响应输出流
				fileItem.writeTo(response.getOutputStream());
				// 提交
				response.getOutputStream().flush();
			} else {
				// 文件不存在
				throw new WebApplicationException(404);
			}
		} catch (WebApplicationException e) {
			throw e;
		} catch (Exception e) {
			throw new WebApplicationException(e);
		}
	}

	@GET
	@Path("{resource}")
	public void resource(@PathParam("resource") String resource, @QueryParam("token") String token,
			@Context HttpServletResponse response) {
		try {
			Criteria criteria = new Criteria();
			ICondition condition = criteria.getConditions().create();
			condition.setAlias(FileRepositoryService.CONDITION_ALIAS_FILE_NAME);
			condition.setValue(resource);
			// 获取文件
			IOperationResult<FileItem> operationResult = this.fetch(criteria, token);
			if (operationResult.getError() != null) {
				throw operationResult.getError();
			}
			FileItem fileItem = operationResult.getResultObjects().firstOrDefault();
			if (fileItem != null) {
				// 设置内容类型
				response.setContentType(this.getContentType(fileItem));
				// 设置缓存时间（单位：秒）
				int cacheAge = 60 * 60 * 24 * 30;
				// 设置缓存控制头
				response.setHeader("Cache-Control", "private, max-age=" + cacheAge);
				response.setDateHeader("Expires", System.currentTimeMillis() + cacheAge * 1000L);
				// 写入响应输出流
				fileItem.writeTo(response.getOutputStream());
				// 提交
				response.getOutputStream().flush();
			} else {
				// 文件不存在
				throw new WebApplicationException(404);
			}
		} catch (WebApplicationException e) {
			throw e;
		} catch (Exception e) {
			throw new WebApplicationException(e);
		}
	}

	@GET
	@Path("barcode")
	public void createBarCode(@HeaderParam("authorization") String authorization, @QueryParam("token") String token,
			@QueryParam("content") String content, @Context HttpServletRequest request,
			@Context HttpServletResponse response) {
		try {
			if (content == null || "".equals(content)) {
				throw new Exception("content is empty");
			}
			// 获取请求参数列表,请求参数中可能出现冲突,故value为数组,取第一个参数值为有效参数
			Map<String, String[]> map = request.getParameterMap();
			Map<String, String> parameterMap = new HashMap<String, String>();
			map.forEach(new BiConsumer<String, String[]>() {
				@Override
				public void accept(String key, String[] value) {
					if (value.length > 0) {
						parameterMap.put(key.toLowerCase(), value[0]);
					}
				}
			});
			// 默认条码类型
			BarcodeFormat format = this.getParameterValue(parameterMap, "format", BarcodeFormat.CODE_128);
			// 设置默认宽度
			int width = this.getParameterValue(parameterMap, "width", 300);
			// 设置默认高度
			int height = this.getParameterValue(parameterMap, "height", 30);
			// 默认title
			String title = this.getParameterValue(parameterMap, "title", "");
			// 默认字号
			Integer fontSize = this.getParameterValue(parameterMap, "fontsize", 15);
			// 默认压缩格式
			String suffix = this.getParameterValue(parameterMap, "suffix", "png");
			Hashtable<EncodeHintType, Object> hints = new Hashtable<EncodeHintType, Object>();
			// 指定纠错等级
			hints.put(EncodeHintType.ERROR_CORRECTION,
					this.getParameterValue(parameterMap, "level", ErrorCorrectionLevel.H));
			// 指定编码格式
			hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
			// 设置白边
			hints.put(EncodeHintType.MARGIN, this.getParameterValue(parameterMap, "margin", 1));
			// 生成条码,条码不能添加logo图片
			byte[] imageData = ZXingCodeUtils.createBarCode(content, format, width, height, hints, title, fontSize,
					null, suffix);
			if (imageData != null) {
				// 设置内容类型
				response.setContentType(
						this.getContentType(String.format("%s.%s", System.currentTimeMillis(), suffix)));
				// 写入响应输出流
				OutputStream os = response.getOutputStream();
				os.write(imageData);
				os.flush();
			} else {
				// 文件不存在
				throw new WebApplicationException(404);
			}
		} catch (Exception e) {
		}
	}

	@GET
	@Path("qrcode")
	public void createQRCode(@HeaderParam("authorization") String authorization, @QueryParam("token") String token,
			@QueryParam("content") String content, @Context HttpServletRequest request,
			@Context HttpServletResponse response) {
		try {
			if (content == null || "".equals(content)) {
				throw new Exception("content is empty");
			}
			// 获取请求参数列表,请求参数中可能出现冲突,故value为数组,取第一个参数值为有效参数
			Map<String, String[]> map = request.getParameterMap();
			Map<String, String> parameterMap = new HashMap<String, String>();
			map.forEach(new BiConsumer<String, String[]>() {
				@Override
				public void accept(String key, String[] value) {
					if (value.length > 0) {
						parameterMap.put(key.toLowerCase(), value[0]);
					}
				}
			});
			// 默认条码类型
			BarcodeFormat format = this.getParameterValue(parameterMap, "format", BarcodeFormat.QR_CODE);
			// 设置默认宽度
			int width = this.getParameterValue(parameterMap, "width", 300);
			// 设置默认高度
			int height = this.getParameterValue(parameterMap, "height", 300);
			// 默认title
			String title = this.getParameterValue(parameterMap, "title", "");
			// 默认字号
			Integer fontSize = this.getParameterValue(parameterMap, "fontsize", 20);
			// 默认logo图片
			String logoUrl = this.getParameterValue(parameterMap, "logo", "");
			InputStream logoImage = this.downloadFileFromUrl(logoUrl);
			// 默认压缩格式
			String suffix = this.getParameterValue(parameterMap, "suffix", "png");
			Hashtable<EncodeHintType, Object> hints = new Hashtable<EncodeHintType, Object>();
			// 指定纠错等级
			hints.put(EncodeHintType.ERROR_CORRECTION,
					this.getParameterValue(parameterMap, "level", ErrorCorrectionLevel.H));
			// 指定编码格式
			hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
			// 设置白边
			hints.put(EncodeHintType.MARGIN, this.getParameterValue(parameterMap, "margin", 1));
			// 生成二维码
			byte[] imageData = ZXingCodeUtils.createBarCode(content, format, width, height, hints, title, fontSize,
					logoImage, suffix);
			if (imageData != null) {
				// 设置内容类型
				response.setContentType(
						this.getContentType(String.format("%s.%s", System.currentTimeMillis(), suffix)));
				// 写入响应输出流
				OutputStream os = response.getOutputStream();
				os.write(imageData);
				os.flush();
			} else {
				// 文件不存在
				throw new WebApplicationException(404);
			}
		} catch (Exception e) {
		}
	}

	@SuppressWarnings("unchecked")
	private <P> P getParameterValue(Map<String, String> map, String key, P defaultValue) {
		String valueString = map.get(key);
		if (valueString == null || valueString.isEmpty()) {
			return defaultValue;
		} else {
			try {
				// 强行转换配置值为P类型
				if (defaultValue != null) {
					return (P) DataConvert.convert(defaultValue.getClass(), valueString);
				}
				return (P) valueString;
			} catch (Exception e) {
				Logger.log(e);
				return defaultValue;
			}
		}
	}

	private InputStream downloadFileFromUrl(String fileUrl) {
		try {
			// 获取连接
			URL url = URI.create(fileUrl).toURL();
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setConnectTimeout(3 * 1000);
			// 设置请求头
			connection.setRequestProperty("User-Agent",
					"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36");
			// 获取输入流
			return connection.getInputStream();
		} catch (Exception e) {
			return null;
		}
	}
}
