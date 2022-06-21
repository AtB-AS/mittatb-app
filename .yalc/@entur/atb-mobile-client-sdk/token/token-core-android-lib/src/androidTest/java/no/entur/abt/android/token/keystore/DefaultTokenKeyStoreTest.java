package no.entur.abt.android.token.keystore;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

import android.util.Log;

import androidx.test.ext.junit.runners.AndroidJUnit4;

import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.PrivateKey;
import java.security.cert.Certificate;
import java.util.Enumeration;
import java.util.UUID;
import java.util.function.Predicate;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import no.entur.abt.android.token.TokenContext;

@RunWith(AndroidJUnit4.class)
public class DefaultTokenKeyStoreTest {

	private static final String TAG = DefaultTokenKeyStoreTest.class.getName();

	protected TokenContext primaryTokenContext = mock(TokenContext.class);
	protected TokenContext secondaryTokenContext = mock(TokenContext.class);
	protected DefaultTokenKeyStore tokenKeyStore;
	protected KeyStore androidKeyStore;

	@Before
	public void before() throws Exception {
		reset(primaryTokenContext);
		when(primaryTokenContext.getId()).thenReturn("primary");

		reset(secondaryTokenContext);
		when(secondaryTokenContext.getId()).thenReturn("secondary");

		androidKeyStore = KeyStore.getInstance("AndroidKeyStore");
		androidKeyStore.load(null);

		tokenKeyStore = DefaultTokenKeyStore.newBuilder().withKeyStore(androidKeyStore).build();

		clear();
	}

	@Test
	public void testCreateEncryptionKey() throws Exception {
		String id = UUID.randomUUID().toString();

		TokenTrustChain encryptionKey = tokenKeyStore.createEncryptionKey(primaryTokenContext, id, new byte[] { 8, 2, 3, 4 });
		assertNotNull(encryptionKey);
		assertNotNull(encryptionKey.getKeyPair());
		assertNotNull(encryptionKey.getCertificateChain());

		assertContainsAlias(s -> s.contains(id));
		assertEquals(1, countAliases());

		PrivateKey encryptionPrivateKey = tokenKeyStore.getEncryptionPrivateKey(primaryTokenContext, id);
		assertNotNull(encryptionPrivateKey);

		Certificate encryptionCertificate = tokenKeyStore.getEncryptionCertificate(primaryTokenContext, id);
		assertNotNull(encryptionCertificate);

		assertTrue(tokenKeyStore.hasTokens());
		assertTrue(tokenKeyStore.hasTokens(primaryTokenContext));

		tokenKeyStore.removeTokens(primaryTokenContext);
		assertFalse(tokenKeyStore.hasTokens());
		assertFalse(tokenKeyStore.hasTokens(primaryTokenContext));
	}

	@Test
	public void testCreateEncryptionKeysInMultipleContexts() throws Exception {
		String id1 = UUID.randomUUID().toString();
		String id2 = UUID.randomUUID().toString();

		TokenTrustChain encryptionKey1 = tokenKeyStore.createEncryptionKey(primaryTokenContext, id1, new byte[] { 8, 2, 3, 4 });
		assertNotNull(encryptionKey1);
		TokenTrustChain encryptionKey2 = tokenKeyStore.createEncryptionKey(secondaryTokenContext, id2, new byte[] { 8, 2, 3, 4, 1, 2, 3, 4 });
		assertNotNull(encryptionKey2);

		assertEquals(2, countAliases());
		assertContainsAlias(s -> s.contains(id1));
		assertContainsAlias(s -> s.contains(id2));

		assertNotNull(tokenKeyStore.getEncryptionPrivateKey(primaryTokenContext, id1));
		assertNotNull(tokenKeyStore.getEncryptionPrivateKey(secondaryTokenContext, id2));

		assertNull(tokenKeyStore.getEncryptionPrivateKey(primaryTokenContext, id2));
		assertNull(tokenKeyStore.getEncryptionPrivateKey(secondaryTokenContext, id1));

		assertNotNull(tokenKeyStore.getEncryptionCertificate(primaryTokenContext, id1));
		assertNotNull(tokenKeyStore.getEncryptionCertificate(secondaryTokenContext, id2));

		assertTrue(tokenKeyStore.hasTokens());
		assertTrue(tokenKeyStore.hasTokens(primaryTokenContext));
		assertTrue(tokenKeyStore.hasTokens(secondaryTokenContext));

		tokenKeyStore.removeTokens(primaryTokenContext);
		assertFalse(tokenKeyStore.hasTokens(primaryTokenContext));
		assertTrue(tokenKeyStore.hasTokens());

		tokenKeyStore.removeTokens(secondaryTokenContext);
		assertFalse(tokenKeyStore.hasTokens(secondaryTokenContext));

		assertFalse(tokenKeyStore.hasTokens());
	}

	@Test
	public void testCreateSignatureKey() throws Exception {
		String id = UUID.randomUUID().toString();

		TokenTrustChain signatureKey = tokenKeyStore.createSignatureKey(primaryTokenContext, id, new byte[] { 1, 2, 1, 4 });
		assertNotNull(signatureKey);
		assertNotNull(signatureKey.getKeyPair());
		assertNotNull(signatureKey.getCertificateChain());

		assertContainsAlias(s -> s.contains(id));
		assertEquals(1, countAliases());

		PrivateKey signaturePrivateKey = tokenKeyStore.getSignaturePrivateKey(primaryTokenContext, id);
		assertNotNull(signaturePrivateKey);

		Certificate signatureCertificate = tokenKeyStore.getSignatureCertificate(primaryTokenContext, id);
		assertNotNull(signatureCertificate);

		assertTrue(tokenKeyStore.hasTokens());
		assertTrue(tokenKeyStore.hasTokens(primaryTokenContext));

		tokenKeyStore.removeTokens(primaryTokenContext);
		assertFalse(tokenKeyStore.hasTokens());
		assertFalse(tokenKeyStore.hasTokens(primaryTokenContext));
	}

	@Test
	public void testCreateSignatureKeysInMultipleContexts() throws Exception {
		String id1 = UUID.randomUUID().toString();
		String id2 = UUID.randomUUID().toString();

		TokenTrustChain encryptionKey1 = tokenKeyStore.createSignatureKey(primaryTokenContext, id1, new byte[] { 8, 2, 3, 4 });
		assertNotNull(encryptionKey1);
		TokenTrustChain encryptionKey2 = tokenKeyStore.createSignatureKey(secondaryTokenContext, id2, new byte[] { 8, 2, 3, 4, 1, 2, 3, 4 });
		assertNotNull(encryptionKey2);

		assertEquals(2, countAliases());
		assertContainsAlias(s -> s.contains(id1));
		assertContainsAlias(s -> s.contains(id2));

		assertNotNull(tokenKeyStore.getSignaturePrivateKey(primaryTokenContext, id1));
		assertNotNull(tokenKeyStore.getSignaturePrivateKey(secondaryTokenContext, id2));

		assertNull(tokenKeyStore.getSignaturePrivateKey(primaryTokenContext, id2));
		assertNull(tokenKeyStore.getSignaturePrivateKey(secondaryTokenContext, id1));

		assertNotNull(tokenKeyStore.getSignatureCertificate(primaryTokenContext, id1));
		assertNotNull(tokenKeyStore.getSignatureCertificate(secondaryTokenContext, id2));

		assertTrue(tokenKeyStore.hasTokens());
		assertTrue(tokenKeyStore.hasTokens(primaryTokenContext));
		assertTrue(tokenKeyStore.hasTokens(secondaryTokenContext));

		tokenKeyStore.removeTokens(primaryTokenContext);
		assertFalse(tokenKeyStore.hasTokens(primaryTokenContext));
		assertTrue(tokenKeyStore.hasTokens());

		tokenKeyStore.removeTokens(secondaryTokenContext);
		assertFalse(tokenKeyStore.hasTokens(secondaryTokenContext));

		assertFalse(tokenKeyStore.hasTokens());
	}

	@Test
	public void testCreateEncryptionAndSignatureKey() throws Exception {
		String id = UUID.randomUUID().toString();

		TokenTrustChain encryptionKey = tokenKeyStore.createEncryptionKey(primaryTokenContext, id, new byte[] { 8, 2, 3, 4 });
		assertNotNull(encryptionKey);

		PrivateKey encryptionPrivateKey = tokenKeyStore.getEncryptionPrivateKey(primaryTokenContext, id);
		assertNotNull(encryptionPrivateKey);

		Certificate encryptionCertificate = tokenKeyStore.getEncryptionCertificate(primaryTokenContext, id);
		assertNotNull(encryptionCertificate);

		TokenTrustChain signatureKey = tokenKeyStore.createSignatureKey(primaryTokenContext, id, new byte[] { 1, 2, 1, 4 });
		assertNotNull(signatureKey);

		assertContainsAlias(s -> s.contains(id));
		assertEquals(2, countAliases());

		PrivateKey signaturePrivateKey = tokenKeyStore.getSignaturePrivateKey(primaryTokenContext, id);
		assertNotNull(signaturePrivateKey);

		Certificate signatureCertificate = tokenKeyStore.getSignatureCertificate(primaryTokenContext, id);
		assertNotNull(signatureCertificate);
	}

	@After
	public void clear() throws KeyStoreException {
		Enumeration<String> aliases = androidKeyStore.aliases();
		while (aliases.hasMoreElements()) {
			androidKeyStore.deleteEntry(aliases.nextElement());
		}
	}

	private int countAliases() throws KeyStoreException {
		int count = 0;
		Enumeration<String> aliases = androidKeyStore.aliases();
		while (aliases.hasMoreElements()) {
			String s = aliases.nextElement();
			Log.d(TAG, "Found alias " + s);
			count++;
		}
		return count;
	}

	private void assertAlias(String string) throws KeyStoreException {
		StringBuilder builder = new StringBuilder();

		Enumeration<String> aliases = androidKeyStore.aliases();
		if (aliases.hasMoreElements()) {
			String s = aliases.nextElement();
			assertEquals(string, s);

			builder.append(s);
			builder.append(" ");

			return;
		}
		fail("No alias " + string + ", only " + builder);
	}

	private void assertContainsAlias(Predicate<String> p) throws KeyStoreException {
		StringBuilder builder = new StringBuilder();

		Enumeration<String> aliases = androidKeyStore.aliases();
		while (aliases.hasMoreElements()) {
			String s = aliases.nextElement();
			if (p.test(s)) {
				return;
			}

			builder.append(s);
			builder.append(" ");
		}

		fail("No matching aliases for " + builder);
	}
}
