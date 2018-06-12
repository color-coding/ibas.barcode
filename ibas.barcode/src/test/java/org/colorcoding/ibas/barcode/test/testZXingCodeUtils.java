package org.colorcoding.ibas.barcode.test;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Hashtable;

import org.colorcoding.ibas.barcode.MyConfiguration;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import junit.framework.TestCase;
import org.colorcoding.ibas.barcode.utils.ZXingCodeException;
import org.colorcoding.ibas.barcode.utils.ZXingCodeUtils;

public class testZXingCodeUtils extends TestCase {

	public void test1DCode() throws ZXingCodeException {

		String txt = "hello world!";
		String imgPath = MyConfiguration.getWorkFolder();
		String imgName = "bar_code.png";
		String suffix = "png";
		File filePath = new File(imgPath);
		if (!filePath.exists()) {
			filePath.mkdirs();
		}

		File imageFile = new File(imgPath, imgName);
		Hashtable<EncodeHintType, Object> hints = new Hashtable<EncodeHintType, Object>();
		// 指定纠错等级
		hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
		// 指定编码格式
		hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
		// 设置白边
		hints.put(EncodeHintType.MARGIN, 1);
		ZXingCodeUtils.createBarCode(txt, BarcodeFormat.CODE_128, 300, 30, hints, txt, 15, null, imageFile);
		System.out.println(String.format("image: %s", imageFile.getPath()));
	}

	public void test2DCode() throws ZXingCodeException {
		String txt = "hello world!";
		String imgPath = MyConfiguration.getWorkFolder();
		String imgName = "qr_code.png";
		String suffix = "png";
		File filePath = new File(imgPath);
		if (!filePath.exists()) {
			filePath.mkdirs();
		}

		File imageFile = new File(imgPath, imgName);
		Hashtable<EncodeHintType, Object> hints = new Hashtable<EncodeHintType, Object>();
		// 指定纠错等级
		hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
		// 指定编码格式
		hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
		// 设置白边
		hints.put(EncodeHintType.MARGIN, 1);
		// 设置logo图片,找不到图片则不添加logo
		InputStream logoImage = null;
		try {
			logoImage = new FileInputStream(new File(imgPath, "1.jpg"));
		} catch (Exception e) {
			logoImage = null;
		}
		ZXingCodeUtils.createBarCode(txt, BarcodeFormat.QR_CODE, 300, 300, hints, txt, 20, logoImage, imageFile);
		System.out.println(String.format("image: %s", imageFile.getPath()));
	}
}
