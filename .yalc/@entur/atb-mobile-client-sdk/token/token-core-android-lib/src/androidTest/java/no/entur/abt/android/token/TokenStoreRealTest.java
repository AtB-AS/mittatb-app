package no.entur.abt.android.token;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import java.security.KeyStore;
import java.security.KeyStoreException;
import java.time.Clock;
import java.time.Instant;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import no.entur.abt.android.token.device.DefaultAttestationStatusProvider;
import no.entur.abt.android.token.device.DefaultDeviceDetailsProvider;
import no.entur.abt.android.token.device.DeviceDetailsProvider;
import no.entur.abt.android.token.keystore.DefaultTokenKeyStore;
import no.entur.abt.android.token.keystore.TokenKeystoreException;
import no.entur.abt.android.token.keystore.TokenTrustChain;
import no.entur.abt.core.exchange.grpc.traveller.v1.AndroidSafetyNetAttestation;

@RunWith(AndroidJUnit4.class)
public class TokenStoreRealTest {

	protected static Clock clock = Clock.systemUTC();

	protected TokenContext tokenContext = new DefaultTokenContext("entur", new ReentrantLock());

	private TokenStore<String> tokenStore;

	private Lock editorLock = new ReentrantLock();

	private KeyStore androidKeyStore;
	private DefaultTokenKeyStore<Object> tokenKeyStore;
	private SharedPreferences sharedPreferences;
	private TokenEncoder tokenEncoder;

	private DefaultAttestationStatusProvider attestationStatusProvider = new DefaultAttestationStatusProvider(false);

	@Before
	public void before() throws Exception {
		androidKeyStore = KeyStore.getInstance("AndroidKeyStore");
		androidKeyStore.load(null);

		tokenKeyStore = DefaultTokenKeyStore.newBuilder().withKeyStore(androidKeyStore).build();

		Context applicationContext = ApplicationProvider.getApplicationContext();
		sharedPreferences = applicationContext.getSharedPreferences("prefs", Context.MODE_PRIVATE);

		DefaultTokenPropertyStore defaultTokenPropertyStore = new DefaultTokenPropertyStore(sharedPreferences, editorLock, 5000);

		DeviceDetailsProvider deviceDetailsProvider = DefaultDeviceDetailsProvider.newBuilder(applicationContext)
				.withApplicationDeviceInfoElement("a", "b", "c")
				.withOsDeviceInfoElement()

				.withNetworkDeviceStatus()
				.withBluetoohDeviceStatus()
				.withNfcDeviceStatus()
				.withDeviceAttestationDeviceStatus(attestationStatusProvider)

				.build();

		tokenEncoder = new TokenEncoder(Clock.systemUTC(), deviceDetailsProvider);
		tokenStore = new TokenStore(tokenKeyStore, tokenEncoder, clock, null, defaultTokenPropertyStore, new DefaultTraceMapper());

		clearKeystore();
		clearPreferences();

		tokenContext.setToken(null);
	}

	@After
	public void clearKeystore() throws KeyStoreException {
		if (androidKeyStore != null) {
			Enumeration<String> aliases = androidKeyStore.aliases();
			while (aliases.hasMoreElements()) {
				androidKeyStore.deleteEntry(aliases.nextElement());
			}
		}
	}

	@After
	public void clearPreferences() {
		if (sharedPreferences != null) {
			SharedPreferences.Editor edit = sharedPreferences.edit();

			Map<String, ?> all = sharedPreferences.getAll();
			for (Map.Entry<String, ?> e : all.entrySet()) {
				edit.remove(e.getKey());
			}
			if (!edit.commit()) {
				throw new RuntimeException();
			}
		}
	}

	@Test
	public void testEmptyReturnsNull() throws TokenPropertyStoreException {
		assertNull(tokenStore.loadToken(tokenContext));
	}

	@Test
	public void testPendingNewToken() throws Exception {
		AndroidSafetyNetAttestation commandAttestation = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{}").build();

		String commandUuid = UUID.randomUUID().toString();
		String commandTrace = UUID.randomUUID().toString();

		List<byte[]> encryptionCertificateChain = Arrays.asList(new byte[] { 0, 0x01 }, new byte[] { 0x02, 0x03 });
		List<byte[]> signatureCertificateChain = Arrays.asList(new byte[] { 0x04, 0x05 }, new byte[] { 0x06, 0x07 });

		PendingToken pendingNewToken = new PendingToken("a", null, null, tokenEncoder, 0, commandUuid, commandAttestation, signatureCertificateChain,
				encryptionCertificateChain, commandTrace, tokenContext);
		tokenStore.savePendingNewToken(pendingNewToken);
		createKeys(pendingNewToken.getTokenId());

		Set<String> tokenContexts = tokenStore.getTokenContextIds();
		assertThat(tokenContexts).hasSize(1);
		assertThat(tokenContext.getId()).isEqualTo(tokenContexts.iterator().next());

		PendingToken token = (PendingToken) tokenStore.loadToken(tokenContext);
		assertNotNull(token);
		assertThat(token.getTokenId()).isEqualTo(pendingNewToken.getTokenId());
		assertThat(token.getCommandAttestation()).isEqualTo(commandAttestation);
		assertThat(token.getCommandUuid()).isEqualTo(commandUuid);
		assertThat(token.getCommandTrace()).isEqualTo(commandTrace);
	}

	@Test
	public void testActivatedToken() throws Exception {

		ActivatedToken<String> token = new ActivatedToken<>("a", Instant.now(), Instant.now().plusSeconds(3600), null, null, null, null, tokenEncoder, clock, 0,
				tokenContext);
		createKeys(token.getTokenId());

		tokenStore.saveToken(token);

		ActivatedToken<String> restored = (ActivatedToken<String>) tokenStore.getToken(tokenContext);
		assertNotNull(restored);
		assertThat(token.getTokenId()).isEqualTo(restored.getTokenId());
		assertNull(token.getRenewToken());

		assertNotNull(tokenContext.getToken());
	}

	@Test
	public void testActivatedTokenWithRenewToken() throws Exception {
		ActivatedToken<String> token = new ActivatedToken<>("a", Instant.now(), Instant.now().plusSeconds(3600), null, null, null, null, tokenEncoder, clock, 0,
				tokenContext);
		createKeys(token.getTokenId());

		AndroidSafetyNetAttestation commandAttestation = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{}").build();
		String commandUuid = UUID.randomUUID().toString();
		String commandTrace = UUID.randomUUID().toString();

		List<byte[]> encryptionCertificateChain = Arrays.asList(new byte[] { 0, 0x01 }, new byte[] { 0x02, 0x03 });
		List<byte[]> signatureCertificateChain = Arrays.asList(new byte[] { 0x04, 0x05 }, new byte[] { 0x06, 0x07 });

		PendingToken pendingRenewalToken = new PendingToken("b", null, null, tokenEncoder, 0, commandUuid, commandAttestation, signatureCertificateChain,
				encryptionCertificateChain, commandTrace, tokenContext);
		createKeys(pendingRenewalToken.getTokenId());

		token.setRenewToken(pendingRenewalToken);

		tokenStore.saveToken(token);

		ActivatedToken<String> restored = (ActivatedToken<String>) tokenStore.getToken(tokenContext);
		assertNotNull(restored);
		assertThat(token.getTokenId()).isEqualTo(restored.getTokenId());

		PendingToken restoredRenewToken = (PendingToken) token.getRenewToken();
		assertThat(restoredRenewToken.getTokenId()).isEqualTo(pendingRenewalToken.getTokenId());

		assertNotNull(restoredRenewToken.getCommandAttestation());
		assertNotNull(restoredRenewToken.getCommandUuid());
		assertNotNull(restoredRenewToken.getCommandTrace());
	}

	@Test
	public void testTwoPendingNewToken() throws Exception {

		AndroidSafetyNetAttestation commandAttestationA = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{a}").build();
		String commandUuidA = UUID.randomUUID().toString();
		String commandTraceA = UUID.randomUUID().toString();

		List<byte[]> encryptionCertificateChainA = Arrays.asList(new byte[] { 0, 0x01 }, new byte[] { 0x02, 0x03 });
		List<byte[]> signatureCertificateChainA = Arrays.asList(new byte[] { 0x04, 0x05 }, new byte[] { 0x06, 0x07 });

		AndroidSafetyNetAttestation commandAttestationB = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{b}").build();
		String commandUuidB = UUID.randomUUID().toString();
		String commandTraceB = UUID.randomUUID().toString();

		List<byte[]> encryptionCertificateChainB = Arrays.asList(new byte[] { 1, 0x11 }, new byte[] { 0x12, 0x31 });
		List<byte[]> signatureCertificateChainB = Arrays.asList(new byte[] { 0x41, 0x51 }, new byte[] { 0x61, 0x71 });

		TokenContext a = new DefaultTokenContext("a", new ReentrantLock());
		TokenContext b = new DefaultTokenContext("b", new ReentrantLock());

		// save tokens in two different token contexts
		PendingToken pendingNewToken1 = new PendingToken("1", null, null, tokenEncoder, 0, commandUuidA, commandAttestationA, signatureCertificateChainA,
				encryptionCertificateChainA, commandTraceA, a);
		createKeys(a, pendingNewToken1.getTokenId());
		tokenStore.savePendingNewToken(pendingNewToken1);

		PendingToken pendingNewToken2 = new PendingToken("2", null, null, tokenEncoder, 0, commandUuidB, commandAttestationB, signatureCertificateChainB,
				encryptionCertificateChainB, commandTraceB, b);
		createKeys(b, pendingNewToken2.getTokenId());
		tokenStore.savePendingNewToken(pendingNewToken2);

		// read back the tokens
		Set<String> tokenContexts = tokenStore.getTokenContextIds();
		assertThat(tokenContexts).hasSize(2);
		assertThat(tokenContexts).containsExactly(a.getId(), b.getId());

		PendingToken token1 = (PendingToken) tokenStore.loadToken(a);
		assertNotNull(token1);
		assertThat(token1.getTokenId()).isEqualTo(pendingNewToken1.getTokenId());
		assertThat(token1.getCommandTrace()).isEqualTo(commandTraceA);
		assertThat(token1.getCommandAttestation()).isEqualTo(commandAttestationA);
		assertThat(token1.getCommandUuid()).isEqualTo(commandUuidA);

		PendingToken token2 = (PendingToken) tokenStore.loadToken(b);
		assertNotNull(token2);
		assertThat(token2.getTokenId()).isEqualTo(pendingNewToken2.getTokenId());

		assertThat(token2.getCommandTrace()).isEqualTo(commandTraceB);
		assertThat(token2.getCommandAttestation()).isEqualTo(commandAttestationB);
		assertThat(token2.getCommandUuid()).isEqualTo(commandUuidB);
	}

	@Test
	public void testClearSingle() throws Exception {
		ActivatedToken<String> token = new ActivatedToken<>("a", Instant.now(), Instant.now().plusSeconds(3600), null, null, null, null, tokenEncoder, clock, 0,
				tokenContext);

		tokenStore.saveToken(token);

		tokenStore.clearToken(tokenContext);

		ActivatedToken<String> restored = (ActivatedToken<String>) tokenStore.loadToken(tokenContext);
		assertNull(restored);
	}

	@Test
	public void testClearAll() throws Exception {
		ActivatedToken<String> token = new ActivatedToken<>("a", Instant.now(), Instant.now().plusSeconds(3600), null, null, null, null, tokenEncoder, clock, 0,
				tokenContext);

		tokenStore.saveToken(token);

		tokenStore.clearAll();

		ActivatedToken<String> restored = (ActivatedToken<String>) tokenStore.loadToken(tokenContext);
		assertNull(restored);
	}

	private void createKeys(TokenContext tokenContext, String tokenId) throws TokenKeystoreException {
		// create keys so that they can be loaded later
		TokenTrustChain signatureKey = tokenKeyStore.createSignatureKey(tokenContext, tokenId, new byte[] { 0 });
		TokenTrustChain encryptionKey = tokenKeyStore.createEncryptionKey(tokenContext, tokenId, new byte[] { 0 });
	}

	private void createKeys(String tokenId) throws TokenKeystoreException {
		createKeys(tokenContext, tokenId);
	}

}
