package no.entur.abt.android.token.exception;

public class TokenSupersededException extends TokenPermanentlyUnavailableException {

	public TokenSupersededException() {
		super();
	}

	public TokenSupersededException(String message) {
		super(message);
	}

	public TokenSupersededException(Throwable t) {
		super(t);
	}

	public TokenSupersededException(String message, Throwable t) {
		super(message, t);
	}
}
