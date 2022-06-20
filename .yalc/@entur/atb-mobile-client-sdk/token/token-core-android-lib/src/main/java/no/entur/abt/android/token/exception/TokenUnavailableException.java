package no.entur.abt.android.token.exception;

public abstract class TokenUnavailableException extends TokenStateException {

	public TokenUnavailableException() {
		super();
	}

	public TokenUnavailableException(String message) {
		super(message);
	}

	public TokenUnavailableException(Throwable t) {
		super(t);
	}

	public TokenUnavailableException(String message, Throwable t) {
		super(message, t);
	}
}
