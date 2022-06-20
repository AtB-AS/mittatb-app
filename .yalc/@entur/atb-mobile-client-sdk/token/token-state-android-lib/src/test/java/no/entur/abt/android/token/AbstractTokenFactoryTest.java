package no.entur.abt.android.token;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.security.KeyPair;
import java.security.PrivateKey;
import java.time.Clock;
import java.util.ArrayList;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.junit.Before;

import no.entur.abt.android.token.attestation.DeviceAttestator;
import no.entur.abt.android.token.keystore.TokenTrustChain;
import no.entur.abt.android.token.remote.RemoteTokenService;
import no.entur.abt.core.exchange.grpc.traveller.v1.AndroidSafetyNetAttestation;

public abstract class AbstractTokenFactoryTest {

	protected static Clock clock = Clock.systemUTC();

	protected TokenStore<String> tokenStore;
	protected RemoteTokenService<String> remoteTokenService;
	protected DeviceAttestator deviceAttestator;
	protected TokenEncoder tokenEncoder;

	protected TokenContext tokenContext;

	protected Lock lock = new ReentrantLock();

	@Before
	public void setUp() throws Exception {
		tokenStore = mock(TokenStore.class);

		remoteTokenService = mock(RemoteTokenService.class);
		deviceAttestator = mock(DeviceAttestator.class);
		tokenEncoder = mock(TokenEncoder.class);

		tokenContext = mock(TokenContext.class);
		when(tokenContext.getId()).thenReturn("entur");
		when(tokenContext.getLock()).thenReturn(lock);
	}

	protected void initKeyStoreMocks(String tokenId, byte[] nonce) throws Exception {
		TokenTrustChain signatureChain = mock(TokenTrustChain.class);
		when(signatureChain.getCertificateChain()).thenReturn(new ArrayList<>());
		when(signatureChain.getPublicEncoded()).thenReturn(new byte[] { 2, 5 });
		when(signatureChain.getPrivate()).thenReturn(mock(PrivateKey.class));

		when(signatureChain.getKeyPair()).thenReturn(new KeyPair(null, null));

		TokenTrustChain encryptionChain = mock(TokenTrustChain.class);
		when(encryptionChain.getCertificateChain()).thenReturn(new ArrayList<>());
		when(encryptionChain.getPublicEncoded()).thenReturn(new byte[] { 3, 6 });
		when(encryptionChain.getPrivate()).thenReturn(mock(PrivateKey.class));
		when(encryptionChain.getKeyPair()).thenReturn(new KeyPair(null, null));

		when(tokenStore.createSignatureKey(tokenContext, tokenId, nonce)).thenReturn(signatureChain);
		when(tokenStore.createEncryptionKey(tokenContext, tokenId, nonce)).thenReturn(encryptionChain);

		AndroidSafetyNetAttestation attestation = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{}").build();
		when(deviceAttestator.attest(nonce, signatureChain.getPublicEncoded(), encryptionChain.getPublicEncoded())).thenReturn(attestation);
	}

}
