package no.entur.abt.android.token.exception;

public class TokenTemporarilyUnavailableException extends TokenUnavailableException {

	public TokenTemporarilyUnavailableException() {
		super();
	}

	public TokenTemporarilyUnavailableException(String message) {
		super(message);
	}

	public TokenTemporarilyUnavailableException(Throwable t) {
		super(t);
	}

	public TokenTemporarilyUnavailableException(String message, Throwable t) {
		super(message, t);
	}
}
