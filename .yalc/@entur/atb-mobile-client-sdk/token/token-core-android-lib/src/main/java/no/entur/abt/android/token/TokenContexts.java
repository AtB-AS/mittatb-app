package no.entur.abt.android.token;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class TokenContexts {

	public static DefaultTokenContextsBuilder newBuilder() {
		return new DefaultTokenContextsBuilder();
	}

	protected final Map<String, TokenContext> contexts;

	public TokenContexts(Map<String, TokenContext> contexts) {
		this.contexts = new HashMap<>(contexts); // thread safe for reading
	}

	public int size() {
		return contexts.size();
	}

	public TokenContext get(String o) {
		return contexts.get(o);
	}

	public Set<String> getTokenContextIds() {
		return contexts.keySet();
	}

	public void clearAllTokens() {
		for (Map.Entry<String, TokenContext> entry : contexts.entrySet()) {
			entry.getValue().setToken(null);
		}

	}
}
