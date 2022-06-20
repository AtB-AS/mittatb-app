package no.entur.abt.android.token.exception;

public class TokenStateException extends TokenException {
	private static final long serialVersionUID = 1L;

	protected TokenStateException() {
		super();
	}

	protected TokenStateException(String message) {
		super(message);
	}

	protected TokenStateException(Throwable t) {
		super(t);
	}

	protected TokenStateException(String message, Throwable t) {
		super(message, t);
	}

}
