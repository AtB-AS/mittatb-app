package no.entur.abt.android.token;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.junit.Before;
import org.junit.Test;

import no.entur.abt.android.test.ThreadHelper;
import no.entur.abt.android.token.exception.TokenStateException;
import no.entur.abt.android.token.exception.TokenSupersededException;
import no.entur.abt.android.token.remote.ActiveTokenDetails;
import no.entur.abt.android.token.remote.PendingTokenDetails;
import no.entur.abt.android.token.remote.exception.TokenMustBeReplacedRemoteTokenStateException;
import no.entur.abt.android.token.remote.exception.TokenNotFoundRemoteTokenStateException;
import no.entur.abt.core.exchange.grpc.traveller.v1.AndroidSafetyNetAttestation;
import no.entur.abt.core.exchange.grpc.traveller.v1.MobileTokenDetails;
import no.entur.abt.core.exchange.pb.v1.SecureContainer;

public class DefaultTokenRenewerTest extends AbstractTokenFactoryTest {

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

	private DefaultTokenRenewer<String> provider;

	@Before
	public void setUp() throws Exception {
		super.setUp();
		provider = new DefaultTokenRenewer<>(tokenStore, remoteTokenService, deviceAttestator, clock, 5000);
	}

	@Test
	public void shouldThrowExceptionOnStrainMismatch() throws Exception {
		ActivatedToken<String> token = mock(ActivatedToken.class);
		when(token.forward()).thenReturn(token);

		doThrow(new TokenSupersededException("test")).when(tokenStore).validateLatestStrain(any(Token.class));

		TokenStateException tokenStateException = assertThrows(TokenStateException.class, () -> {
			provider.renew(token, UUID.randomUUID().toString());
		});
		assertThat(tokenStateException).isInstanceOf(TokenSupersededException.class);
	}

	@Test
	public void shouldReturnAlreadyRenewedToken() throws Exception {
		ActivatedToken<String> token = mock(ActivatedToken.class);
		when(token.getTokenId()).thenReturn("a");
		when(token.getTokenContext()).thenReturn(tokenContext);

		ActivatedToken<String> renewedToken = mock(ActivatedToken.class);
		when(renewedToken.getTokenId()).thenReturn("b");
		when(renewedToken.getTokenContext()).thenReturn(tokenContext);

		when(token.getRenewToken()).thenReturn(renewedToken);
		when(token.hasRenewToken()).thenReturn(true);
		when(renewedToken.forward()).thenReturn(renewedToken);

		when(token.forward()).thenReturn(renewedToken);

		ActivatedToken<String> renew = provider.renew(token, UUID.randomUUID().toString());
		assertThat(renew.getTokenId()).isEqualTo("b");
	}

	@Test
	public void shouldRenewToken() throws Exception {
		ActivatedToken<String> token = mock(ActivatedToken.class);
		when(token.getTokenId()).thenReturn("a");
		when(token.encodeAsSecureContainer(any(TokenEncodingRequest.class))).thenReturn(SecureContainer.newBuilder().build());
		when(token.forward()).thenReturn(token);
		when(token.hasRenewToken()).thenReturn(false);
		when(token.getTokenContext()).thenReturn(tokenContext);

		PendingToken pendingRenewedToken = mock(PendingToken.class);

		AndroidSafetyNetAttestation pendingRenewedCommandAttestation = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{}").build();
		String pendingRenewedCommandUuid = UUID.randomUUID().toString();
		String pendingRenewedCommandTrace = UUID.randomUUID().toString();

		List<byte[]> pendingRenewedEncryptionCertificateChain = Arrays.asList(new byte[] { 11, 0x1 }, new byte[] { 0x1, 0x1 });
		List<byte[]> pendingRenewedSignatureCertificateChain = Arrays.asList(new byte[] { 0x4, 0x5 }, new byte[] { 0x6, 0x7 });

		when(pendingRenewedToken.getTokenId()).thenReturn("b");
		when(pendingRenewedToken.getCommandTrace()).thenReturn(pendingRenewedCommandTrace);
		when(pendingRenewedToken.getCommandAttestation()).thenReturn(pendingRenewedCommandAttestation);
		when(pendingRenewedToken.getCommandUuid()).thenReturn(pendingRenewedCommandUuid);
		when(pendingRenewedToken.getEncryptionCertificateChain()).thenReturn(pendingRenewedEncryptionCertificateChain);
		when(pendingRenewedToken.getSignatureCertificateChain()).thenReturn(pendingRenewedSignatureCertificateChain);
		when(pendingRenewedToken.getCommandUuid()).thenReturn(pendingRenewedCommandUuid);

		when(pendingRenewedToken.getTokenContext()).thenReturn(tokenContext);

		when(token.getRenewToken()).thenReturn(pendingRenewedToken);

		ActivatedToken<String> renewedToken = mock(ActivatedToken.class);
		when(renewedToken.getTokenId()).thenReturn("b");

		byte[] nonce = { 0, 1, 2 };

		PendingTokenDetails pendingTokenDetails = new PendingTokenDetails(renewedToken.getTokenId(), nonce);

		byte[] certificate = new byte[] { 0x00, 0x11 };
		Instant validityStart = Instant.ofEpochMilli(System.currentTimeMillis() / 1000);
		Instant validityEnd = Instant.ofEpochMilli(validityStart.getEpochSecond() + 30);

		ActiveTokenDetails activeTokenDetails = new ActiveTokenDetails(certificate, validityStart, validityEnd);

		when(remoteTokenService.initiateMobileTokenRenewal(any(ActivatedToken.class), any(SecureContainer.class), any(String.class)))
				.thenReturn(pendingTokenDetails); // 1

		when(remoteTokenService.completeMobileTokenRenewal(any(ActivatedToken.class), any(PendingToken.class), any(SecureContainer.class)))
				.thenReturn(activeTokenDetails); // 2

		initKeyStoreMocks(renewedToken.getTokenId(), nonce);

		when(tokenStore.createPendingToken(any(ActivatedToken.class), any(String.class), any(byte[].class), any(String.class))).thenReturn(pendingRenewedToken);

		when(tokenStore.convertPendingTokenToActiveToken(token, pendingRenewedToken, certificate, validityStart, validityEnd)).thenReturn(renewedToken);

		ActivatedToken<String> renew = provider.renew(token, UUID.randomUUID().toString());
		assertThat(renew.getTokenId()).isEqualTo("b");
	}

	@Test
	public void shouldActivatePendingToken() throws Exception {
		ActivatedToken<String> token = mock(ActivatedToken.class);
		when(token.getTokenId()).thenReturn("a");
		when(token.forward()).thenReturn(token);
		when(token.encodeAsSecureContainer(any(TokenEncodingRequest.class))).thenReturn(SecureContainer.newBuilder().build());
		when(token.getTokenContext()).thenReturn(tokenContext);

		PendingToken pendingRenewedToken = mock(PendingToken.class);

		AndroidSafetyNetAttestation pendingRenewedCommandAttestation = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{}").build();
		String pendingRenewedCommandUuid = UUID.randomUUID().toString();
		String pendingRenewedCommandTrace = UUID.randomUUID().toString();

		List<byte[]> pendingRenewedEncryptionCertificateChain = Arrays.asList(new byte[] { 11, 0x1 }, new byte[] { 0x1, 0x1 });
		List<byte[]> pendingRenewedSignatureCertificateChain = Arrays.asList(new byte[] { 0x4, 0x5 }, new byte[] { 0x6, 0x7 });

		when(pendingRenewedToken.getTokenId()).thenReturn("b");
		when(pendingRenewedToken.getCommandTrace()).thenReturn(pendingRenewedCommandTrace);
		when(pendingRenewedToken.getCommandAttestation()).thenReturn(pendingRenewedCommandAttestation);
		when(pendingRenewedToken.getCommandUuid()).thenReturn(pendingRenewedCommandUuid);
		when(pendingRenewedToken.getEncryptionCertificateChain()).thenReturn(pendingRenewedEncryptionCertificateChain);
		when(pendingRenewedToken.getSignatureCertificateChain()).thenReturn(pendingRenewedSignatureCertificateChain);
		when(pendingRenewedToken.getTokenContext()).thenReturn(tokenContext);

		when(token.getRenewToken()).thenReturn(pendingRenewedToken);
		when(token.hasRenewToken()).thenReturn(true);

		ActivatedToken<String> renewedToken = mock(ActivatedToken.class);
		when(renewedToken.getTokenId()).thenReturn("c");
		when(renewedToken.getTokenContext()).thenReturn(tokenContext);

		byte[] certificate = new byte[] { 0x00, 0x11 };
		Instant validityStart = Instant.ofEpochMilli(System.currentTimeMillis() / 1000);
		Instant validityEnd = Instant.ofEpochMilli(validityStart.getEpochSecond() + 30);

		ActiveTokenDetails activeTokenDetails = new ActiveTokenDetails(certificate, validityStart, validityEnd);

		when(remoteTokenService.completeMobileTokenRenewal(any(ActivatedToken.class), any(PendingToken.class), any(SecureContainer.class)))
				.thenReturn(activeTokenDetails); // 2

		when(tokenStore.convertPendingTokenToActiveToken(any(ActivatedToken.class), any(PendingToken.class), any(byte[].class), any(Instant.class),
				any(Instant.class))).thenReturn(renewedToken);

		ActivatedToken<String> renew = provider.renew(token, UUID.randomUUID().toString());
		assertThat(renew.getTokenId()).isEqualTo("c");
	}

	@Test
	public void shouldActivatePendingTokenWhichAlreadyWasActiveOnServeside() throws Exception {
		ActivatedToken<String> token = mock(ActivatedToken.class);
		when(token.getTokenId()).thenReturn("a");
		when(token.forward()).thenReturn(token);
		when(token.getTokenContext()).thenReturn(tokenContext);

		SecureContainer secureContainerToken = SecureContainer.newBuilder().build();
		when(token.encodeAsSecureContainer(any(TokenEncodingRequest.class))).thenReturn(secureContainerToken);

		PendingToken pendingRenewedToken = mock(PendingToken.class);

		AndroidSafetyNetAttestation pendingRenewedCommandAttestation = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{}").build();
		String pendingRenewedCommandUuid = UUID.randomUUID().toString();
		String pendingRenewedCommandTrace = UUID.randomUUID().toString();

		List<byte[]> pendingRenewedEncryptionCertificateChain = Arrays.asList(new byte[] { 11, 0x1 }, new byte[] { 0x1, 0x1 });
		List<byte[]> pendingRenewedSignatureCertificateChain = Arrays.asList(new byte[] { 0x4, 0x5 }, new byte[] { 0x6, 0x7 });

		when(pendingRenewedToken.getTokenId()).thenReturn("b");
		when(pendingRenewedToken.getCommandTrace()).thenReturn(pendingRenewedCommandTrace);
		when(pendingRenewedToken.getCommandAttestation()).thenReturn(pendingRenewedCommandAttestation);
		when(pendingRenewedToken.getCommandUuid()).thenReturn(pendingRenewedCommandUuid);
		when(pendingRenewedToken.getEncryptionCertificateChain()).thenReturn(pendingRenewedEncryptionCertificateChain);
		when(pendingRenewedToken.getSignatureCertificateChain()).thenReturn(pendingRenewedSignatureCertificateChain);
		when(pendingRenewedToken.getTokenContext()).thenReturn(tokenContext);

		SecureContainer pendingRenewedTokenSecureContainerToken = SecureContainer.newBuilder().build(); // for signing new request for details
		when(pendingRenewedToken.encodeAsSecureContainer(any(TokenEncodingRequest.class))).thenReturn(pendingRenewedTokenSecureContainerToken);

		when(token.getRenewToken()).thenReturn(pendingRenewedToken);
		when(token.hasRenewToken()).thenReturn(true);

		ActivatedToken<String> renewedToken = mock(ActivatedToken.class);
		when(renewedToken.getTokenId()).thenReturn("c");
		when(renewedToken.getTokenContext()).thenReturn(tokenContext);

		MobileTokenDetails details = MobileTokenDetails.newBuilder().setTokenId("c").build();

		byte[] certificate = new byte[] { 0x00, 0x11 };
		Instant validityStart = Instant.ofEpochMilli(System.currentTimeMillis() / 1000);
		Instant validityEnd = Instant.ofEpochMilli(validityStart.getEpochSecond() + 30);

		ActiveTokenDetails activeTokenDetails = new ActiveTokenDetails(certificate, validityStart, validityEnd);

		when(remoteTokenService.completeMobileTokenRenewal(any(ActivatedToken.class), any(PendingToken.class), any(SecureContainer.class)))
				.thenThrow(new TokenMustBeReplacedRemoteTokenStateException()); // 1

		when(remoteTokenService.getMobileTokenDetails(any(Token.class), any(SecureContainer.class), any(String.class))).thenReturn(activeTokenDetails);

		when(tokenStore.convertPendingTokenToActiveToken(any(ActivatedToken.class), any(PendingToken.class), any(byte[].class), any(Instant.class),
				any(Instant.class))).thenReturn(renewedToken);

		ActivatedToken<String> renew = provider.renew(token, UUID.randomUUID().toString());
		assertThat(renew.getTokenId()).isEqualTo("c");
	}

	@Test
	public void shouldDicardPendingTokenWhichTheServerRespondsIsUnknown() throws Exception {
		ActivatedToken<String> token = mock(ActivatedToken.class);
		when(token.forward()).thenReturn(token);
		when(token.getTokenId()).thenReturn("a");
		when(token.getTokenContext()).thenReturn(tokenContext);

		when(token.encodeAsSecureContainer(any(TokenEncodingRequest.class))).thenReturn(SecureContainer.newBuilder().build());

		AndroidSafetyNetAttestation commandAttestation1 = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{a}").build();
		String commandUuid1 = UUID.randomUUID().toString();
		String commandTrace1 = UUID.randomUUID().toString();

		List<byte[]> encryptionCertificateChain1 = Arrays.asList(new byte[] { 1, 0x11 }, new byte[] { 0x12, 0x31 });
		List<byte[]> signatureCertificateChain1 = Arrays.asList(new byte[] { 0x41, 0x51 }, new byte[] { 0x61, 0x71 });

		PendingToken pendingRenewedTokenWhichServerDoesNotKnow = mock(PendingToken.class);
		when(pendingRenewedTokenWhichServerDoesNotKnow.getTokenId()).thenReturn("x");
		when(pendingRenewedTokenWhichServerDoesNotKnow.getCommandAttestation()).thenReturn(commandAttestation1);
		when(pendingRenewedTokenWhichServerDoesNotKnow.getCommandUuid()).thenReturn(commandUuid1);
		when(pendingRenewedTokenWhichServerDoesNotKnow.getCommandTrace()).thenReturn(commandTrace1);
		when(pendingRenewedTokenWhichServerDoesNotKnow.getEncryptionCertificateChain()).thenReturn(encryptionCertificateChain1);
		when(pendingRenewedTokenWhichServerDoesNotKnow.getSignatureCertificateChain()).thenReturn(signatureCertificateChain1);

		when(pendingRenewedTokenWhichServerDoesNotKnow.getTokenContext()).thenReturn(tokenContext);

		when(token.hasRenewToken()).thenReturn(true);

		AndroidSafetyNetAttestation commandAttestation2 = AndroidSafetyNetAttestation.newBuilder().setJwsResult("{b}").build();
		String commandUuid2 = UUID.randomUUID().toString();
		String commandTrace2 = UUID.randomUUID().toString();

		List<byte[]> encryptionCertificateChain2 = Arrays.asList(new byte[] { 11, 0x1 }, new byte[] { 0x1, 0x1 });
		List<byte[]> signatureCertificateChain2 = Arrays.asList(new byte[] { 0x4, 0x5 }, new byte[] { 0x6, 0x7 });

		PendingToken pendingRenewedToken2 = mock(PendingToken.class);
		when(pendingRenewedToken2.getTokenId()).thenReturn("b");
		when(pendingRenewedToken2.getCommandAttestation()).thenReturn(commandAttestation2);
		when(pendingRenewedToken2.getCommandUuid()).thenReturn(commandUuid2);
		when(pendingRenewedToken2.getCommandTrace()).thenReturn(commandTrace2);
		when(pendingRenewedToken2.getEncryptionCertificateChain()).thenReturn(encryptionCertificateChain2);
		when(pendingRenewedToken2.getSignatureCertificateChain()).thenReturn(signatureCertificateChain2);

		when(pendingRenewedToken2.getTokenContext()).thenReturn(tokenContext);

		when(token.getRenewToken()).thenReturn(pendingRenewedTokenWhichServerDoesNotKnow).thenReturn(pendingRenewedToken2);

		ActivatedToken<String> renewedToken = mock(ActivatedToken.class);
		when(renewedToken.getTokenId()).thenReturn("b");

		byte[] nonce = { 0, 1, 2 };

		PendingTokenDetails pendingTokenDetails = new PendingTokenDetails(renewedToken.getTokenId(), nonce);

		// create token for renewal
		initKeyStoreMocks(renewedToken.getTokenId(), nonce);

		when(tokenStore.createPendingToken(any(ActivatedToken.class), any(String.class), any(byte[].class), any(String.class)))
				.thenReturn(pendingRenewedToken2);

		byte[] certificate = new byte[] { 0x00, 0x11 };
		Instant validityStart = Instant.ofEpochMilli(System.currentTimeMillis() / 1000);
		Instant validityEnd = Instant.ofEpochMilli(validityStart.getEpochSecond() + 30);

		ActiveTokenDetails activeTokenDetails = new ActiveTokenDetails(certificate, validityStart, validityEnd);

		// complete call

		// convert pending token to activate token
		when(tokenStore.convertPendingTokenToActiveToken(token, pendingRenewedToken2, certificate, validityStart, validityEnd)).thenReturn(renewedToken);

		when(remoteTokenService.initiateMobileTokenRenewal(any(ActivatedToken.class), any(SecureContainer.class), any(String.class)))
				.thenReturn(pendingTokenDetails); // 2

		when(remoteTokenService.completeMobileTokenRenewal(any(ActivatedToken.class), any(PendingToken.class), any(SecureContainer.class)))
				.thenThrow(new TokenNotFoundRemoteTokenStateException()) // 1
				.thenReturn(activeTokenDetails); // 3

		ActivatedToken<String> renew = provider.renew(token, UUID.randomUUID().toString());
		assertThat(renew.getTokenId()).isEqualTo("b");
	}

	@Test
	public void shouldThrowExceptionIfAnotherThreadBlocksRenewForTooLong() throws Exception {
		ThreadHelper helper = new ThreadHelper().addRun(lockRunnable).addPause().addRun(unlockRunnable);
		try {
			helper.start();
			while (helper.getState() != Thread.State.WAITING) {
				Thread.yield();
			}

			assertThrows(TokenStateException.class, () -> {
				ActivatedToken<String> token = mock(ActivatedToken.class);
				when(token.forward()).thenReturn(token);
				when(token.getTokenContext()).thenReturn(tokenContext);

				provider.renew(token, UUID.randomUUID().toString());
			});
		} finally {
			helper.close();
		}
	}

}
