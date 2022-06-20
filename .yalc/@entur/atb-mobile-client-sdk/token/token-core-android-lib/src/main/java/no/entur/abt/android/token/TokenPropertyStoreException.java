package no.entur.abt.android.token;

import no.entur.abt.android.token.exception.UnableToSaveTokenException;

public class TokenPropertyStoreException extends UnableToSaveTokenException {
	public TokenPropertyStoreException(String message) {
		super(message);
	}

	public TokenPropertyStoreException(InterruptedException e) {
		super(e);
	}
}
