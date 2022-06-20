package no.entur.abt.android.token;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class DefaultTokenContext<T> implements TokenContext<T> {

	public static <T> TokenContextBuilder newBuilder() {
		return new TokenContextBuilder<T>();
	}

	public static class TokenContextBuilder<T> {
		private String id;
		private Lock lock;

		public TokenContextBuilder<T> withId(String id) {
			this.id = id;
			return this;
		}

		public TokenContextBuilder<T> withLock(Lock lock) {
			this.lock = lock;
			return this;
		}

		public TokenContext<T> build() {
			if (id == null) {
				throw new IllegalStateException();
			}

			// renewer is optional at build time

			// id can't contain separator, as we have to parse the property values
			for (int i = 0; i < id.length(); i++) {
				if (id.charAt(i) == DefaultTokenPropertyStore.SEPARATOR) {
					throw new IllegalStateException("Expected context id without '" + DefaultTokenPropertyStore.SEPARATOR + "'");
				}
			}

			if (lock == null) {
				lock = new ReentrantLock();
			}
			return new DefaultTokenContext<>(id, lock);
		}
	}

	private final String id;

	// simple helper for detecting that an old token already has superseded
	protected final AtomicInteger strainNumber = new AtomicInteger();
	protected final Lock lock;

	protected volatile Token token;

	public DefaultTokenContext(String id, Lock lock) {
		this.id = id;
		this.lock = lock;
	}

	@Override
	public String getId() {
		return id;
	}

	@Override
	public int incrementStrainNumber() {
		return strainNumber.incrementAndGet();
	}

	public boolean isLatestStrain(int strainNumber) {
		return strainNumber == this.strainNumber.intValue();
	}

	@Override
	public Token getToken() {
		return token;
	}

	@Override
	public void setToken(Token token) {
		this.token = token;
	}

	@Override
	public int getStrainNumber() {
		return strainNumber.get();
	}

	@Override
	public Lock getLock() {
		return lock;
	}

}
