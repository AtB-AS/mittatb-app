package no.entur.abt.android.token.exception;

public class TokenExpiredException extends TokenPermanentlyUnavailableException {

	public TokenExpiredException() {
		super();
	}

	public TokenExpiredException(String message) {
		super(message);
	}

	public TokenExpiredException(Throwable t) {
		super(t);
	}

	public TokenExpiredException(String message, Throwable t) {
		super(message, t);
	}
}
