package no.entur.abt.android.token.exception;

public class TokenCommandException extends TokenStateException {

	protected TokenCommandException() {
		super();
	}

	protected TokenCommandException(String message) {
		super(message);
	}

	public TokenCommandException(Throwable t) {
		super(t);
	}

	protected TokenCommandException(String message, Throwable t) {
		super(message, t);
	}
}
