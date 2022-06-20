package no.entur.abt.android.token;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DefaultTokenContextsBuilder {

	private List<TokenContext> builders = new ArrayList<>();

	public DefaultTokenContextsBuilder withContext(TokenContext tokenContext) {
		builders.add(tokenContext);

		return this;
	}

	public TokenContexts build() {
		Map<String, TokenContext> contexts = new HashMap<>();

		for (TokenContext tokenContext : builders) {
			if (contexts.containsKey(tokenContext.getId())) {
				throw new IllegalStateException("Duplicate token context " + tokenContext.getId());
			}
			contexts.put(tokenContext.getId(), tokenContext);
		}
		return new TokenContexts(contexts);
	}

}
