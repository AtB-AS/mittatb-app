package no.entur.abt.android.token.exception;

public class TokenException extends Exception {

	public TokenException() {
		super();
	}

	public TokenException(String message) {
		super(message);
	}

	public TokenException(Throwable t) {
		super(t);
	}

	public TokenException(String message, Throwable t) {
		super(message, t);
	}

}
