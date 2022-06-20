package no.entur.abt.android.token;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import android.content.SharedPreferences;
import android.util.Base64;

import androidx.test.ext.junit.runners.AndroidJUnit4;

import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.UnrecoverableEntryException;
import java.security.cert.Certificate;
import java.time.Clock;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import no.entur.abt.android.token.keystore.TokenKeyStore;
import no.entur.abt.android.token.keystore.TokenKeystoreException;
import no.entur.abt.android.token.keystore.TokenTrustChain;
import no.entur.abt.core.exchange.grpc.traveller.v1.AndroidSafetyNetAttestation;

@RunWith(AndroidJUnit4.class) // Base64 does work without
public class TokenStoreMockTest {

	private TokenKeyStore keyStore = mock(TokenKeyStore.class);

	protected static Clock clock = Clock.systemUTC();

	protected TokenContext tokenContext = mock(TokenContext.class);

	private TokenStore<String> tokenStore;
	private TokenEncoder tokenEncoder = mock(TokenEncoder.class);
	private SharedPreferences sharedPreferences = mock(SharedPreferences.class);
	private SharedPreferences.Editor editor = mock(SharedPreferences.Editor.class);

	private Lock lock = new ReentrantLock();

	private DefaultTokenPropertyStore defaultTokenPropertyStore;

	@Before
	public void before() throws TokenKeystoreException, KeyStoreException {
		reset(tokenEncoder);
		reset(sharedPreferences);
		reset(editor);
		reset(tokenContext);

		defaultTokenPropertyStore = new DefaultTokenPropertyStore(sharedPreferences, lock, 5000);

		tokenStore = new TokenStore<>(keyStore, tokenEncoder, clock, null, defaultTokenPropertyStore, new DefaultTraceMapper());

		when(sharedPreferences.edit()).thenReturn(editor);
		when(editor.commit()).thenReturn(true);

		when(tokenContext.getId()).thenReturn("entur");

		when(keyStore.getEncryptionCertificate(any(TokenContext.class), anyString())).thenReturn(mock(Certificate.class));
		when(keyStore.getSignatureCertificate(any(TokenContext.class), anyString())).thenReturn(mock(Certificate.class));
	}

	@Test
	public void testEmptyReturnsNull() throws TokenPropertyStoreException {
		assertNull(tokenStore.loadToken(tokenContext));
	}

	@Test
	public void testLoadPendingNewToken()
			throws TokenPropertyStoreException, TokenKeystoreException, UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException {
		String id = "a";

		AndroidSafetyNetAttestation attestation = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{}").build();
		String uuid = UUID.randomUUID().toString();
		String trace = UUID.randomUUID().toString();

		when(sharedPreferences.getString(defaultTokenPropertyStore.getPendingNewTokenIdKey(tokenContext), null)).thenReturn(id);

		String attestationAsBase64 = Base64.encodeToString(attestation.toByteArray(), Base64.NO_WRAP);
		when(sharedPreferences.getString(defaultTokenPropertyStore.getPendingNewTokenCommandAttestationKey(tokenContext), null))
				.thenReturn(attestationAsBase64);
		when(sharedPreferences.getString(defaultTokenPropertyStore.getPendingNewTokenCommandAttestationTypeKey(tokenContext), null))
				.thenReturn(TokenStore.getAttetationType(attestation));

		when(sharedPreferences.getString(defaultTokenPropertyStore.getPendingNewTokenCommandUuidKey(tokenContext), null)).thenReturn(uuid);

		String traceAsBase64 = Base64.encodeToString(trace.getBytes(StandardCharsets.UTF_8), Base64.NO_WRAP);
		when(sharedPreferences.getString(defaultTokenPropertyStore.getPendingNewTokenCommandTraceKey(tokenContext), null)).thenReturn(traceAsBase64);

		List<byte[]> encryptionCertificateChainA = Arrays.asList(new byte[] { 0, 0x01 }, new byte[] { 0x02, 0x03 });
		List<byte[]> signatureCertificateChainA = Arrays.asList(new byte[] { 0x04, 0x05 }, new byte[] { 0x06, 0x07 });

		PublicKey signaturePublicKey = mock(PublicKey.class);
		when(signaturePublicKey.getEncoded()).thenReturn(new byte[] { 0x00 });

		PublicKey encryptionPublicKey = mock(PublicKey.class);
		when(encryptionPublicKey.getEncoded()).thenReturn(new byte[] { 0x01 });

		when(keyStore.getSignatureTrustChain(any(TokenContext.class), eq(id)))
				.thenReturn(new TokenTrustChain(new KeyPair(signaturePublicKey, null), signatureCertificateChainA));
		when(keyStore.getEncryptionTrustChain(any(TokenContext.class), eq(id)))
				.thenReturn(new TokenTrustChain(new KeyPair(encryptionPublicKey, null), encryptionCertificateChainA));

		PendingToken token = (PendingToken) tokenStore.loadToken(tokenContext);
		assertThat(token.getTokenId()).isEqualTo(id);
		assertThat(token.getCommandUuid()).isEqualTo(uuid);
		assertThat(token.getCommandAttestation()).isEqualTo(attestation);
		assertThat(token.getCommandTrace()).isEqualTo(trace);
	}

	@Test
	public void testLoadToken() throws TokenPropertyStoreException {
		String id = "a";

		long start = System.currentTimeMillis();
		long end = start + 1000;

		when(sharedPreferences.getString(defaultTokenPropertyStore.getTokenIdKey(tokenContext), null)).thenReturn(id);
		when(sharedPreferences.getLong(defaultTokenPropertyStore.getTokenValidityStartKey(tokenContext), -1L)).thenReturn(start);
		when(sharedPreferences.getLong(defaultTokenPropertyStore.getTokenValidityEndKey(tokenContext), -1L)).thenReturn(end);

		ActivatedToken<String> token = (ActivatedToken<String>) tokenStore.loadToken(tokenContext);
		assertThat(token.getTokenId()).isEqualTo(id);
		assertThat(token.getValidityStart().toEpochMilli()).isEqualTo(start);
		assertThat(token.getValidityEnd().toEpochMilli()).isEqualTo(end);
	}

	@Test
	public void testLoadTokenIfNoTokenInTokenContext() throws TokenPropertyStoreException {
		String id = "a";

		long start = System.currentTimeMillis();
		long end = start + 1000;

		when(sharedPreferences.getString(defaultTokenPropertyStore.getTokenIdKey(tokenContext), null)).thenReturn(id);
		when(sharedPreferences.getLong(defaultTokenPropertyStore.getTokenValidityStartKey(tokenContext), -1L)).thenReturn(start);
		when(sharedPreferences.getLong(defaultTokenPropertyStore.getTokenValidityEndKey(tokenContext), -1L)).thenReturn(end);

		ActivatedToken<String> token = (ActivatedToken<String>) tokenStore.getToken(tokenContext);
		assertThat(token.getTokenId()).isEqualTo(id);
		assertThat(token.getValidityStart().toEpochMilli()).isEqualTo(start);
		assertThat(token.getValidityEnd().toEpochMilli()).isEqualTo(end);

		verify(tokenContext, times(1)).setToken(token);
	}

	@Test
	public void testLoadTokenWithPendingRenewToken()
			throws TokenPropertyStoreException, TokenKeystoreException, UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException {
		String id = "a";
		String pendingId = "b";

		long start = System.currentTimeMillis();
		long end = start + 1000;

		when(sharedPreferences.getString(defaultTokenPropertyStore.getTokenIdKey(tokenContext), null)).thenReturn(id);
		when(sharedPreferences.getLong(defaultTokenPropertyStore.getTokenValidityStartKey(tokenContext), -1L)).thenReturn(start);
		when(sharedPreferences.getLong(defaultTokenPropertyStore.getTokenValidityEndKey(tokenContext), -1L)).thenReturn(end);

		AndroidSafetyNetAttestation commandAttestation = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{}").build();
		String commandUuid = UUID.randomUUID().toString();
		String commandTrace = UUID.randomUUID().toString();

		when(sharedPreferences.getString(defaultTokenPropertyStore.getPendingRenewalTokenIdKey(tokenContext), null)).thenReturn(pendingId);
		when(sharedPreferences.getString(defaultTokenPropertyStore.getPendingRenewalTokenCommandAttestationKey(tokenContext), null))
				.thenReturn(Base64.encodeToString(commandAttestation.toByteArray(), Base64.NO_WRAP));
		when(sharedPreferences.getString(defaultTokenPropertyStore.getPendingRenewalTokenCommandAttestationTypeKey(tokenContext), null))
				.thenReturn(tokenStore.getAttetationType(commandAttestation));

		when(sharedPreferences.getString(defaultTokenPropertyStore.getPendingRenewalTokenCommandUuidKey(tokenContext), null))
				.thenReturn(Base64.encodeToString(commandUuid.getBytes(StandardCharsets.UTF_8), Base64.NO_WRAP));

		when(sharedPreferences.getString(defaultTokenPropertyStore.getPendingRenewalTokenCommandTraceKey(tokenContext), null))
				.thenReturn(Base64.encodeToString(commandTrace.getBytes(StandardCharsets.UTF_8), Base64.NO_WRAP));

		List<byte[]> encryptionCertificateChainA = Arrays.asList(new byte[] { 0, 0x01 }, new byte[] { 0x02, 0x03 });
		List<byte[]> signatureCertificateChainA = Arrays.asList(new byte[] { 0x04, 0x05 }, new byte[] { 0x06, 0x07 });

		PublicKey signaturePublicKey = mock(PublicKey.class);
		when(signaturePublicKey.getEncoded()).thenReturn(new byte[] { 0x00 });

		PublicKey encryptionPublicKey = mock(PublicKey.class);
		when(encryptionPublicKey.getEncoded()).thenReturn(new byte[] { 0x01 });

		when(keyStore.getSignatureTrustChain(any(TokenContext.class), eq(id)))
				.thenReturn(new TokenTrustChain(new KeyPair(signaturePublicKey, null), signatureCertificateChainA));
		when(keyStore.getEncryptionTrustChain(any(TokenContext.class), eq(id)))
				.thenReturn(new TokenTrustChain(new KeyPair(encryptionPublicKey, null), encryptionCertificateChainA));

		List<byte[]> encryptionCertificateChainB = Arrays.asList(new byte[] { 0, 0x01 }, new byte[] { 0x02, 0x04 });
		List<byte[]> signatureCertificateChainB = Arrays.asList(new byte[] { 0x04, 0x05 }, new byte[] { 0x06, 0x08 });

		PublicKey signaturePublicKeyB = mock(PublicKey.class);
		when(signaturePublicKeyB.getEncoded()).thenReturn(new byte[] { 0x00 });

		PublicKey encryptionPublicKeyB = mock(PublicKey.class);
		when(encryptionPublicKeyB.getEncoded()).thenReturn(new byte[] { 0x01 });

		when(keyStore.getSignatureTrustChain(any(TokenContext.class), eq(pendingId)))
				.thenReturn(new TokenTrustChain(new KeyPair(signaturePublicKeyB, null), signatureCertificateChainB));
		when(keyStore.getEncryptionTrustChain(any(TokenContext.class), eq(pendingId)))
				.thenReturn(new TokenTrustChain(new KeyPair(encryptionPublicKeyB, null), encryptionCertificateChainB));

		ActivatedToken<String> token = (ActivatedToken<String>) tokenStore.loadToken(tokenContext);
		assertThat(token.getTokenId()).isEqualTo(id);
		assertThat(token.getValidityStart().toEpochMilli()).isEqualTo(start);
		assertThat(token.getValidityEnd().toEpochMilli()).isEqualTo(end);

		PendingToken renewToken = (PendingToken) token.getRenewToken();
		assertThat(renewToken.getTokenId()).isEqualTo(pendingId);
		assertNotNull(renewToken.getCommandUuid());
		assertNotNull(renewToken.getCommandAttestation());
		assertNotNull(renewToken.getCommandTrace());
	}

	@Test
	public void testSave() throws Exception {
		ActivatedToken<String> token = new ActivatedToken<>("a", Instant.now(), Instant.now().plusSeconds(3600), null, null, null, null, tokenEncoder, clock, 0,
				tokenContext);

		tokenStore.saveToken(token);

		verify(editor, times(1)).putLong(defaultTokenPropertyStore.getTokenValidityStartKey(tokenContext), token.getValidityStart().toEpochMilli());
		verify(editor, times(1)).putLong(defaultTokenPropertyStore.getTokenValidityEndKey(tokenContext), token.getValidityEnd().toEpochMilli());
		verify(editor, times(1)).putString(defaultTokenPropertyStore.getTokenIdKey(tokenContext), token.getTokenId());
		verify(editor, times(1)).commit();
	}

	@Test
	public void testSaveClearsPreviousToken() throws Exception {
		String id = "b";
		when(sharedPreferences.getString(defaultTokenPropertyStore.getTokenIdKey(tokenContext), null)).thenReturn(id);

		ActivatedToken<String> token = new ActivatedToken<>("a", Instant.now(), Instant.now().plusSeconds(3600), null, null, null, null, tokenEncoder, clock, 0,
				tokenContext);

		tokenStore.saveToken(token);

		verify(keyStore, times(1)).removeToken(tokenContext, id);
	}

	@Test
	public void testClear() throws Exception {
		tokenStore.clearToken(tokenContext);

		verify(editor, times(1)).remove(defaultTokenPropertyStore.getTokenValidityStartKey(tokenContext));
		verify(editor, times(1)).remove(defaultTokenPropertyStore.getTokenValidityEndKey(tokenContext));
		verify(editor, times(1)).remove(defaultTokenPropertyStore.getTokenIdKey(tokenContext));
		verify(editor, times(1)).commit();

		verify(keyStore, times(1)).removeTokens(any(TokenContext.class));
	}
}
