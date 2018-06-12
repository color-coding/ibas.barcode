package org.colorcoding.ibas.barcode.utils;

public class ZXingCodeException extends Exception {
	private static final long serialVersionUID = 5140381427555264451L;

	public ZXingCodeException() {
		super();
	}

	public ZXingCodeException(String message, Throwable exception) {
		super(message, exception);
	}

	public ZXingCodeException(String message) {
		super(message);
	}

	public ZXingCodeException(Throwable exception) {
		super(exception);
	}
}
