package no.entur.abt.android.token.exception;

public class TokenPermanentlyUnavailableException extends TokenUnavailableException {

	public TokenPermanentlyUnavailableException() {
		super();
	}

	public TokenPermanentlyUnavailableException(String message) {
		super(message);
	}

	public TokenPermanentlyUnavailableException(Throwable t) {
		super(t);
	}

	public TokenPermanentlyUnavailableException(String message, Throwable t) {
		super(message, t);
	}
}
