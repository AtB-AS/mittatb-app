package no.entur.abt.android.token.remote;

import no.entur.abt.android.token.ActivatedToken;
import no.entur.abt.android.token.PendingToken;
import no.entur.abt.android.token.Token;
import no.entur.abt.android.token.attestation.DeviceAttestationException;
import no.entur.abt.android.token.exception.DeviceAttestationRemoteException;
import no.entur.abt.android.token.exception.TokenCommandException;
import no.entur.abt.android.token.remote.exception.RemoteTokenStateException;
import no.entur.abt.core.exchange.pb.v1.SecureContainer;

public interface RemoteTokenService<T> {

	ActiveTokenDetails getMobileTokenDetails(Token<T> token, SecureContainer secureContainerToken, T traceId)
			throws DeviceAttestationException, DeviceAttestationRemoteException, RemoteTokenStateException;

	PendingTokenDetails initiateMobileTokenRenewal(ActivatedToken<T> currentToken, SecureContainer secureContainerToken, T traceId)
			throws DeviceAttestationException, DeviceAttestationRemoteException, RemoteTokenStateException;

	ActiveTokenDetails completeMobileTokenRenewal(ActivatedToken<T> currentToken, PendingToken<T> pendingToken, SecureContainer secureContainerToken)
			throws DeviceAttestationException, DeviceAttestationRemoteException, TokenCommandException, RemoteTokenStateException;

	ActiveTokenDetails activateNewMobileToken(PendingToken<T> pendingNewToken) throws DeviceAttestationRemoteException, TokenCommandException;

}
