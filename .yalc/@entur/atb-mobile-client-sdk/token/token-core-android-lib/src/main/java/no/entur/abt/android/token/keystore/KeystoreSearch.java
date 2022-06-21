package no.entur.abt.android.token.keystore;

import java.security.KeyStoreException;
import java.util.Set;

public interface KeystoreSearch {

	Set<String> findAllAliases() throws KeyStoreException;

	Set<String> findAliases(String tokenContextId) throws KeyStoreException;

	Set<String> findAliases(String tokenContextId, String tokenId) throws KeyStoreException;
}
