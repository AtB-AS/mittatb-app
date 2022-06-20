package no.entur.abt.android.token;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.junit.Before;
import org.junit.Test;

import no.entur.abt.android.test.ThreadHelper;
import no.entur.abt.android.token.exception.TokenStateException;
import no.entur.abt.android.token.remote.ActiveTokenDetails;
import no.entur.abt.core.exchange.grpc.traveller.v1.AndroidSafetyNetAttestation;
import no.entur.abt.core.exchange.pb.v1.SecureContainer;

public class TokenFactoryTest extends AbstractTokenFactoryTest {

	private Runnable lockRunnable = new Runnable() {
		@Override
		public void run() {
			if (!tokenContext.getLock().tryLock()) {
				throw new RuntimeException();
			}
		}
	};

	private Runnable unlockRunnable = new Runnable() {
		@Override
		public void run() {
			tokenContext.getLock().unlock();
		}
	};

	private TokenFactory tokenFactory;

	@Before
	public void setUp() throws Exception {
		super.setUp();
		tokenFactory = new TokenFactory(tokenStore, remoteTokenService, deviceAttestator, clock, 5000);
	}

	@Test
	public void shouldReturnNullIfNoToken() throws Exception {
		assertNull(tokenFactory.getToken(tokenContext, UUID.randomUUID().toString()));
	}

	@Test
	public void shouldReturnToken() throws Exception {
		ActivatedToken token = mock(ActivatedToken.class);
		when(tokenStore.getToken(tokenContext)).thenReturn(token);
		when(token.forward()).thenReturn(token);
		assertNotNull(tokenFactory.getToken(tokenContext, UUID.randomUUID().toString()));
	}

	@Test
	public void shouldCreatePendingNewTokenAndActivateIt() throws Exception {
		ActivatedToken activatedToken = mock(ActivatedToken.class);
		when(activatedToken.getTokenId()).thenReturn("a");
		when(activatedToken.encodeAsSecureContainer(any(TokenEncodingRequest.class))).thenReturn(SecureContainer.newBuilder().build());
		when(activatedToken.getTokenContext()).thenReturn(tokenContext);

		AndroidSafetyNetAttestation pendingNewCommandAttestation = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{}").build();
		String pendingNewCommandUuid = UUID.randomUUID().toString();
		String pendingNewCommandTrace = UUID.randomUUID().toString();

		List<byte[]> pendingNewEncryptionCertificateChain = Arrays.asList(new byte[] { 11, 0x1 }, new byte[] { 0x1, 0x1 });
		List<byte[]> pendingNewSignatureCertificateChain = Arrays.asList(new byte[] { 0x4, 0x5 }, new byte[] { 0x6, 0x7 });

		PendingToken pendingNewToken = mock(PendingToken.class);
		when(pendingNewToken.getTokenId()).thenReturn("a");
		when(pendingNewToken.getCommandTrace()).thenReturn(pendingNewCommandTrace);
		when(pendingNewToken.getCommandAttestation()).thenReturn(pendingNewCommandAttestation);
		when(pendingNewToken.getCommandUuid()).thenReturn(pendingNewCommandUuid);
		when(pendingNewToken.getEncryptionCertificateChain()).thenReturn(pendingNewEncryptionCertificateChain);
		when(pendingNewToken.getSignatureCertificateChain()).thenReturn(pendingNewSignatureCertificateChain);
		when(pendingNewToken.getTokenContext()).thenReturn(tokenContext);

		byte[] nonce = { 0, 1, 2 };

		initKeyStoreMocks(activatedToken.getTokenId(), nonce);

		when(tokenStore.createPendingNewToken(any(TokenContext.class), any(String.class), any(byte[].class), any(String.class))).thenReturn(pendingNewToken);

		Instant validityStart = Instant.now();
		Instant validityEnd = validityStart.plusMillis(1000 * 3600);
		byte[] bytes = new byte[] { 3, 4, 5, 6 };

		when(remoteTokenService.activateNewMobileToken(any(PendingToken.class))).thenReturn(new ActiveTokenDetails(bytes, validityStart, validityEnd));

		when(tokenStore.convertPendingTokenToActiveToken(any(PendingToken.class), any(byte[].class), any(Instant.class), any(Instant.class)))
				.thenReturn(activatedToken);

		ActivatedToken newToken = tokenFactory.createNewToken(tokenContext, "a", nonce, UUID.randomUUID().toString());

		assertThat(newToken.getTokenId()).isEqualTo("a");

		verify(tokenStore, times(1)).createPendingNewToken(any(TokenContext.class), any(String.class), any(byte[].class), any(String.class));
		verify(tokenStore, times(1)).convertPendingTokenToActiveToken(any(PendingToken.class), any(byte[].class), any(Instant.class), any(Instant.class));
	}

	@Test
	public void shouldActivatePreviouslySavedPendingNewToken() throws Exception {
		AndroidSafetyNetAttestation pendingNewCommandAttestation = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{}").build();
		String pendingNewCommandUuid = UUID.randomUUID().toString();
		String pendingNewCommandTrace = UUID.randomUUID().toString();

		List<byte[]> pendingNewEncryptionCertificateChain = Arrays.asList(new byte[] { 11, 0x1 }, new byte[] { 0x1, 0x1 });
		List<byte[]> pendingNewSignatureCertificateChain = Arrays.asList(new byte[] { 0x4, 0x5 }, new byte[] { 0x6, 0x7 });

		PendingToken pendingNewToken = mock(PendingToken.class);
		when(pendingNewToken.getTokenId()).thenReturn("a");
		when(pendingNewToken.getCommandTrace()).thenReturn(pendingNewCommandTrace);
		when(pendingNewToken.getCommandAttestation()).thenReturn(pendingNewCommandAttestation);
		when(pendingNewToken.getCommandUuid()).thenReturn(pendingNewCommandUuid);
		when(pendingNewToken.getEncryptionCertificateChain()).thenReturn(pendingNewEncryptionCertificateChain);
		when(pendingNewToken.getSignatureCertificateChain()).thenReturn(pendingNewSignatureCertificateChain);
		when(pendingNewToken.isLatestStrain()).thenReturn(true);

		when(tokenStore.getToken(tokenContext)).thenReturn(pendingNewToken);

		ActivatedToken activatedToken = mock(ActivatedToken.class);
		when(activatedToken.getTokenId()).thenReturn("a");

		Instant validityStart = Instant.now();
		Instant validityEnd = validityStart.plusMillis(1000 * 3600);
		byte[] bytes = new byte[] { 3, 4, 5, 6 };

		when(remoteTokenService.activateNewMobileToken(any(PendingToken.class))).thenReturn(new ActiveTokenDetails(bytes, validityStart, validityEnd));
		when(tokenStore.convertPendingTokenToActiveToken(any(PendingToken.class), any(byte[].class), any(Instant.class), any(Instant.class)))
				.thenReturn(activatedToken);

		ActivatedToken createdToken = tokenFactory.getToken(tokenContext, UUID.randomUUID().toString());
		assertThat(createdToken.getTokenId()).isEqualTo("a");
	}

	@Test
	public void shouldThrowExceptionIfAnotherThreadBlocksGetForTooLong() throws Exception {
		ThreadHelper helper = new ThreadHelper().addRun(lockRunnable).addPause().addRun(unlockRunnable);
		try {
			helper.start();
			while (helper.getState() != Thread.State.WAITING) {
				Thread.yield();
			}

			assertThrows(TokenStateException.class, () -> {
				tokenFactory.getToken(tokenContext, UUID.randomUUID().toString());
			});
		} finally {
			helper.close();
		}
	}

}
