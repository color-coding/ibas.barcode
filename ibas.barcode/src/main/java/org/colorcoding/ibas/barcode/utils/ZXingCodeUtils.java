package org.colorcoding.ibas.barcode.utils;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import javax.imageio.ImageIO;

import org.colorcoding.ibas.bobas.message.Logger;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

/**
 * 条码/二维码生成工具
 */
public class ZXingCodeUtils {
	/**
	 * 生成条码/二维码
	 *
	 * @param contents  内容
	 * @param format    条码格式
	 * @param width     宽度
	 * @param height    高度
	 * @param hints     设置二维码的格式参数
	 * @param title     条码/二维码下方显示的文字,为null则不显示文字
	 * @param fontSize  条码/二维码下方显示的文字字号
	 * @param logoImage 二维码图片中间包含的logo图片流，如果不存在，则生成不带logo图片的二维码
	 * @param outFile   二维码输出路径，如果为null则表示不输出图片到指定位置
	 * @throws ZXingCodeException
	 */
	public static void createBarCode(String contents, BarcodeFormat format, int width, int height,
			Map<EncodeHintType, Object> hints, String title, Integer fontSize, InputStream logoImage, File outFile)
			throws ZXingCodeException {
		try {
			String suffix = outFile.getAbsolutePath().substring(outFile.getAbsolutePath().lastIndexOf(".") + 1);
			BufferedImage image = createBarCode(contents, format, width, height, hints, title, fontSize, logoImage);
			if (!ImageIO.write(image, suffix, outFile)) {
				throw new IOException("Could not write an image of format " + format + " to " + outFile);
			}
		} catch (Exception e) {
			throw new ZXingCodeException(e);
		}
	}

	/**
	 * 生成条码/二维码
	 *
	 * @param contents  内容
	 * @param format    条码格式
	 * @param width     宽度
	 * @param height    高度
	 * @param hints     设置二维码的格式参数
	 * @param title     条码/二维码下方显示的文字,为null则不显示文字
	 * @param fontSize  条码/二维码下方显示的文字字号
	 * @param logoImage 二维码图片中间包含的logo图片流，如果不存在，则生成不带logo图片的二维码
	 * @param suffix    二维码压缩格式(jpg,png)
	 * @return
	 * @throws ZXingCodeException
	 */
	public static byte[] createBarCode(String contents, BarcodeFormat format, int width, int height,
			Map<EncodeHintType, Object> hints, String title, Integer fontSize, InputStream logoImage, String suffix)
			throws ZXingCodeException {
		try (ByteArrayOutputStream result = new ByteArrayOutputStream()) {
			BufferedImage image = createBarCode(contents, format, width, height, hints, title, fontSize, logoImage);
			if (!ImageIO.write(image, suffix, result)) {
				throw new IOException("Could not write an image of format " + format + " to OutputStream");
			}
			return result.toByteArray();
		} catch (Exception e) {
			Logger.log(e);
			throw new ZXingCodeException(e);
		}
	}

	/**
	 * 生成条码/二维码
	 *
	 * @param contents  内容
	 * @param format    条码格式
	 * @param width     宽度
	 * @param height    高度
	 * @param hints     设置二维码的格式参数
	 * @param title     条码/二维码下方显示的文字,为null则不显示文字
	 * @param fontSize  条码/二维码下方显示的文字字号
	 * @param logoImage 二维码图片中间包含的logo图片流，如果不存在，则生成不带logo图片的二维码
	 * @return
	 * @throws ZXingCodeException
	 */
	static BufferedImage createBarCode(String contents, BarcodeFormat format, int width, int height,
			Map<EncodeHintType, Object> hints, String title, Integer fontSize, InputStream logoImage)
			throws ZXingCodeException {
		try {
			// 如果不是要生成二维码,不能添加logo图片
			if (!format.equals(BarcodeFormat.QR_CODE)) {
				logoImage = null;
			}
			if (logoImage != null) {
				// 指定纠错等级为高
				hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
			}
			BitMatrix bitMatrix = new MultiFormatWriter().encode(contents, format, width, height, hints);
			MatrixToImageConfig config = new MatrixToImageConfig(0xFF000000, 0xFFFFFFFF);
			BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix, config);
			if (title != null || logoImage != null) {
				image = appendLogoOrTitle(image, title, fontSize, logoImage);
			}
			return image;
		} catch (Exception e) {
			Logger.log(e);
			throw new ZXingCodeException(e);
		}
	}

	/**
	 * 对生成的条码/二维码图片添加logo图片、描述
	 *
	 * @param image     生成的条码/二维码图片
	 * @param title     要添加的描述,为null则不添加(添加描述最终图片的高度会增加)
	 * @param fontSize  条码/二维码下方显示的文字字号
	 * @param logoImage logo图片流,为null则不添加(二维码的纠错级别要设为高,否则可能会出现解析失败的问题)
	 * @return 处理后的图片
	 * @throws IOException
	 */
	private static BufferedImage appendLogoOrTitle(BufferedImage image, String title, Integer fontSize,
			InputStream logoImage) throws IOException {
		try {
			// 如果logo图片存在，则加入到二维码图片中
			if (logoImage != null) {
				Graphics2D g = image.createGraphics();
				// 读取Logo图片
				BufferedImage logo = ImageIO.read(logoImage);
				// TODO: 是否有必要关闭输入流
				logoImage.close();
				// 设置logo的大小,暂定为1:5
				int ratio = 5;
				int widthLogo = image.getWidth() / ratio, heightLogo = image.getHeight() / ratio;
				// logo放在中心
				int x = (image.getWidth() - widthLogo) / 2;
				int y = (image.getHeight() - heightLogo) / 2;
				// 开始绘制图片
				g.drawImage(logo, x, y, widthLogo, heightLogo, null);
				// 画个小圆框
				g.drawRoundRect(x, y, widthLogo, heightLogo, 15, 15);
				g.dispose();
				logo.flush();
			}
			// 如果需要在图片下面添加文字
			if (title != null && !"".equals(title)) {
				// 文字高度
				if (fontSize == null || fontSize <= 0) {
					fontSize = 20;
				}
				Font font = new Font("Default", Font.PLAIN, fontSize);
				int titleHeight = getFontMaxHeight(font);
				// 新的图片，把带logo的二维码下面加上文字
				BufferedImage outImage = new BufferedImage(image.getWidth(), image.getHeight() + titleHeight,
						BufferedImage.TYPE_INT_RGB);
				Graphics2D outg = outImage.createGraphics();
				outg.setColor(Color.WHITE);
				outg.fillRect(0, 0, outImage.getWidth(), outImage.getHeight());
				// 画二维码到新的面板
				outg.drawImage(image, 0, 0, image.getWidth(), image.getHeight(), null);
				// 画文字到新的面板
				outg.setColor(Color.BLACK);
				// 字体、字型、字号
				outg.setFont(font);
				int strWidth = outg.getFontMetrics().stringWidth(title);
				if (strWidth > outImage.getWidth()) {
					// 画文字
					// 长度过长就截取前面部分
					outg.drawString(title, 0, image.getHeight() + fontSize);
				} else {
					// 画文字
					outg.drawString(title, (outImage.getWidth() - strWidth) / 2, image.getHeight() + fontSize);
				}
				outg.dispose();
				outImage.flush();
				image = outImage;
			}
			return image;
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * 获取字体最大高度,字体的高度由Asent+baseline+decent组成,如字号20指的是Asent+baseline的高度
	 * https://www.linuxidc.com/upload/2011_02/110211082116831.jpg
	 *
	 * @param font
	 * @return
	 */
	private static int getFontMaxHeight(Font font) {
		Graphics2D graphics2D = new BufferedImage(1, 1, BufferedImage.TYPE_INT_RGB).createGraphics();
		graphics2D.setFont(font);
		return graphics2D.getFontMetrics().getHeight();
	}
}
