package no.entur.abt.android.token.exception;

public class TokenLocalTimeoutException extends TokenTemporarilyUnavailableException {

	public TokenLocalTimeoutException() {
		super();
	}

	public TokenLocalTimeoutException(String message) {
		super(message);
	}

	public TokenLocalTimeoutException(Throwable t) {
		super(t);
	}

	public TokenLocalTimeoutException(String message, Throwable t) {
		super(message, t);
	}
}
