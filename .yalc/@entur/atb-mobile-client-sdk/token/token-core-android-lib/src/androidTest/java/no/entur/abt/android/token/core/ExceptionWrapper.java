package no.entur.abt.android.token.core;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;

public class ExceptionWrapper {

	// exception message
	private String message;
	private String stacktrace;

	public ExceptionWrapper(Exception exception) {
		this.message = exception.getMessage();

		try (ByteArrayOutputStream bout = new ByteArrayOutputStream(); PrintStream w = new PrintStream(bout);) {
			exception.printStackTrace(w);
			this.stacktrace = bout.toString();
		} catch (IOException e) {
			throw new RuntimeException();
		}
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getStacktrace() {
		return stacktrace;
	}

	public void setStacktrace(String stacktrace) {
		this.stacktrace = stacktrace;
	}
}
