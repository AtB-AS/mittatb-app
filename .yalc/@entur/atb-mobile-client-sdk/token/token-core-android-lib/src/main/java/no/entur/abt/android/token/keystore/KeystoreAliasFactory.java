package no.entur.abt.android.token.keystore;

/**
 * 
 * Key alias factory. Format: <br>
 * <br>
 * 1. global prefix<br>
 * 2. token context<br>
 * 3. token id<br>
 * 4. key<br>
 */

public interface KeystoreAliasFactory {

	String getAlias(String tokenContextId, String tokenId, String key);

	String getTokenAliasPrefix(String tokenContextId, String tokenId);

	String getContextAliasPrefix(String tokenContextId);

	String getGlobalAliasPrefix();

	String getEncryptionKeyAlias(String tokenContextId, String tokenId);

	String getSignatureKeyAlias(String tokenContextId, String tokenId);

}
