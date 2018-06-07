package org.colorcoding.ibas.barcode.test;

import java.io.File;
import java.io.IOException;
import java.util.Hashtable;

import org.colorcoding.ibas.barcode.MyConfiguration;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import junit.framework.TestCase;

public class testBarCode extends TestCase {

	public void test1DCode() throws WriterException, IOException {

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
		MatrixToImageConfig config = new MatrixToImageConfig(0xFF000000, 0xFFFFFFFF);
		BitMatrix bitMatrix = new MultiFormatWriter().encode(txt, BarcodeFormat.CODE_128, 300, 30, hints);
		// bitMatrix = deleteWhite(bitMatrix);
		MatrixToImageWriter.writeToPath(bitMatrix, suffix, imageFile.toPath(), config);
		System.out.println(String.format("image: %s", imageFile.getPath()));
	}

	public void test2DCode() throws WriterException, IOException {
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
		hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
		// 指定编码格式
		hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
		// 设置白边
		hints.put(EncodeHintType.MARGIN, 1);
		MatrixToImageConfig config = new MatrixToImageConfig(0xFF000000, 0xFFFFFFFF);
		BitMatrix bitMatrix = new MultiFormatWriter().encode(txt, BarcodeFormat.QR_CODE, 300, 300, hints);
		// bitMatrix = deleteWhite(bitMatrix);
		MatrixToImageWriter.writeToPath(bitMatrix, suffix, imageFile.toPath(), config);
		System.out.println(String.format("image: %s", imageFile.getPath()));
	}
}
