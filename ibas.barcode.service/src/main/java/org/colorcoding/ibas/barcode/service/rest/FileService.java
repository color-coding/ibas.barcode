package org.colorcoding.ibas.barcode.service.rest;

import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import java.util.function.BiConsumer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.colorcoding.ibas.barcode.utils.ZXingCodeUtils;
import org.colorcoding.ibas.bobas.data.DataConvert;
import org.colorcoding.ibas.bobas.message.Logger;
import org.colorcoding.ibas.barcode.MyConfiguration;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.data.FileData;
import org.colorcoding.ibas.bobas.repository.FileRepository;
import org.colorcoding.ibas.bobas.repository.jersey.FileRepositoryService;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;

@Path("file")
public class FileService extends FileRepositoryService {
	/**
	 * 一维条码的标记
	 */
	public final static String BARCODE_SIGN = "1";

	public final static String WORK_FOLDER = MyConfiguration.getConfigValue(
			MyConfiguration.CONFIG_ITEM_BARCODE_FILE_FOLDER,
			MyConfiguration.getDataFolder() + File.separator + "barcode_files");

	public FileService() {
		// 设置工作目录
		this.getRepository().setRepositoryFolder(FileService.WORK_FOLDER);
	}

	@POST
	@Path("upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public OperationResult<FileData> upload(FormDataMultiPart formData, @QueryParam("token") String token) {
		return super.save(formData.getField("file"), token);
	}

	@POST
	@Path("download")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public void download(Criteria criteria, @QueryParam("token") String token, @Context HttpServletResponse response) {
		try {
			// 获取文件
			IOperationResult<FileData> operationResult = this.fetch(criteria, token);
			if (operationResult.getError() != null) {
				throw operationResult.getError();
			}
			FileData fileData = operationResult.getResultObjects().firstOrDefault();
			if (fileData != null) {
				// 设置文件名
				response.setHeader("Content-Disposition",
						String.format("attachment;filename=%s", fileData.getFileName()));
				// 设置内容类型
				response.setContentType(MediaType.APPLICATION_OCTET_STREAM);
				// 写入响应输出流
				OutputStream os = response.getOutputStream();
				os.write(fileData.getFileBytes());
				os.flush();
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
			condition.setAlias(FileRepository.CRITERIA_CONDITION_ALIAS_FILE_NAME);
			condition.setValue(resource);
			// 获取文件
			IOperationResult<FileData> operationResult = this.fetch(criteria, token);
			if (operationResult.getError() != null) {
				throw operationResult.getError();
			}
			FileData fileData = operationResult.getResultObjects().firstOrDefault();
			if (fileData != null) {
				// 设置内容类型
				response.setContentType(this.getContentType(fileData));
				// 写入响应输出流
				OutputStream os = response.getOutputStream();
				os.write(fileData.getFileBytes());
				os.flush();
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
	public void createBarCode(@QueryParam("token") String token,
							  @QueryParam("content") String content,
							  @Context HttpServletRequest request,
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
			//默认条码类型
			BarcodeFormat format = this.getParameterValue(parameterMap, "format", BarcodeFormat.CODE_128);
			//设置默认宽度
			int width = this.getParameterValue(parameterMap, "width", 300);
			//设置默认高度
			int height = this.getParameterValue(parameterMap, "height", 30);
			//默认title
			String title = this.getParameterValue(parameterMap, "title", "");
			//默认字号
			Integer fontSize = this.getParameterValue(parameterMap, "fontsize", 15);
			//默认压缩格式
			String suffix = this.getParameterValue(parameterMap, "suffix", "png");
			Hashtable<EncodeHintType, Object> hints = new Hashtable<EncodeHintType, Object>();
			// 指定纠错等级
			hints.put(EncodeHintType.ERROR_CORRECTION, this.getParameterValue(parameterMap, "level",ErrorCorrectionLevel.H));
			// 指定编码格式
			hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
			// 设置白边
			hints.put(EncodeHintType.MARGIN, this.getParameterValue(parameterMap, "margin", 1));
			// 生成条码,条码不能添加logo图片
			byte[] imageData = ZXingCodeUtils.createBarCode(content, format, width, height, hints, title, fontSize, null, suffix);
			if (imageData != null) {
				// 设置内容类型
				response.setContentType(this.getContentType(String.format("%s.%s", System.currentTimeMillis(), suffix)));
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
	public void createQRCode(@QueryParam("token") String token,
							 @QueryParam("content") String content,
							 @Context HttpServletRequest request,
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
			//默认条码类型
			BarcodeFormat format = this.getParameterValue(parameterMap, "format", BarcodeFormat.QR_CODE);
			//设置默认宽度
			int width = this.getParameterValue(parameterMap, "width", 300);
			//设置默认高度
			int height = this.getParameterValue(parameterMap, "height", 300);
			//默认title
			String title = this.getParameterValue(parameterMap, "title", "");
			//默认字号
			Integer fontSize = this.getParameterValue(parameterMap, "fontsize", 20);
			// 默认logo图片
			String logoUrl = this.getParameterValue(parameterMap, "logo", "");
			InputStream logoImage = this.downloadFileFromUrl(logoUrl);
			//默认压缩格式
			String suffix = this.getParameterValue(parameterMap, "suffix", "png");
			Hashtable<EncodeHintType, Object> hints = new Hashtable<EncodeHintType, Object>();
			// 指定纠错等级
			hints.put(EncodeHintType.ERROR_CORRECTION, this.getParameterValue(parameterMap, "level",ErrorCorrectionLevel.H));
			// 指定编码格式
			hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
			// 设置白边
			hints.put(EncodeHintType.MARGIN, this.getParameterValue(parameterMap, "margin", 1));
			// 生成二维码
			byte[] imageData = ZXingCodeUtils.createBarCode(content, format, width, height, hints, title, fontSize, logoImage, suffix);
			if (imageData != null) {
				// 设置内容类型
				response.setContentType(this.getContentType(String.format("%s.%s", System.currentTimeMillis(), suffix)));
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
			//获取连接
			URL url = new URL(fileUrl);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setConnectTimeout(3 * 1000);
			//设置请求头
			connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36");
			//获取输入流
			return connection.getInputStream();
		} catch (Exception e) {
			return null;
		}
	}
}
