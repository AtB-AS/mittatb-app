package no.entur.abt.android.token.keystore;

import java.security.KeyStore;
import java.security.KeyStoreException;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Set;

public class DefaultKeystoreSearch implements KeystoreSearch {

	protected final KeystoreAliasFactory keystoreAliasFactory;
	protected final KeyStore keyStore;

	public DefaultKeystoreSearch(KeystoreAliasFactory keystoreAliasFactory, KeyStore keyStore) {
		this.keystoreAliasFactory = keystoreAliasFactory;
		this.keyStore = keyStore;
	}

	@Override
	public Set<String> findAllAliases() throws KeyStoreException {
		return findAliasesImpl(keystoreAliasFactory.getGlobalAliasPrefix());
	}

	@Override
	public Set<String> findAliases(String tokenContextId) throws KeyStoreException {
		return findAliasesImpl(keystoreAliasFactory.getContextAliasPrefix(tokenContextId));
	}

	@Override
	public Set<String> findAliases(String tokenContextId, String tokenId) throws KeyStoreException {
		return findAliasesImpl(keystoreAliasFactory.getTokenAliasPrefix(tokenContextId, tokenId));
	}

	protected Set<String> findAliasesImpl(String prefix) throws KeyStoreException {
		Set<String> results = new HashSet<>();
		Enumeration<String> aliases = keyStore.aliases();
		while (aliases.hasMoreElements()) {
			String s = aliases.nextElement();
			if (s.startsWith(prefix)) {
				results.add(s);
			}
		}
		return results;
	}
}
