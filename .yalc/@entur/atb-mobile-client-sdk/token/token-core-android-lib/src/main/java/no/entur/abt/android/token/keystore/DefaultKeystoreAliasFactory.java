package no.entur.abt.android.token.keystore;

public class DefaultKeystoreAliasFactory implements KeystoreAliasFactory {

	protected static final char SEPERATOR = ':'; // do not use '-' as it is in the token

	protected static final String ENCRYPTION_KEY = "encryption";
	protected static final String SIGNATURE_KEY = "token";

	protected final String globalPrefixWithPrefix;

	public DefaultKeystoreAliasFactory(String globalPrefix) {
		this.globalPrefixWithPrefix = globalPrefix + SEPERATOR;
	}

	@Override
	public String getEncryptionKeyAlias(String tokenContextId, String tokenId) {
		return getAlias(tokenContextId, tokenId, ENCRYPTION_KEY);
	}

	@Override
	public String getSignatureKeyAlias(String tokenContextId, String tokenId) {
		return getAlias(tokenContextId, tokenId, SIGNATURE_KEY);
	}

	@Override
	public String getAlias(String tokenContextId, String tokenId, String alias) {
		return getTokenAliasPrefix(tokenContextId, tokenId) + alias;
	}

	public String getTokenAliasPrefix(String tokenContextId, String tokenId) {
		return getContextAliasPrefix(tokenContextId) + tokenId + SEPERATOR;
	}

	public String getContextAliasPrefix(String tokenContextId) {
		return globalPrefixWithPrefix + tokenContextId + SEPERATOR;
	}

	public String getGlobalAliasPrefix() {
		return globalPrefixWithPrefix;
	}

}
