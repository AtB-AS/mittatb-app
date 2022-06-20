package no.entur.abt.android.token.attestation;

import android.util.Log;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.safetynet.SafetyNetApi;
import com.google.android.gms.safetynet.SafetyNetClient;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;

import no.entur.abt.android.token.device.DeviceDetailsProvider;
import no.entur.abt.core.exchange.grpc.traveller.v1.AndroidSafetyNetAttestation;
import no.entur.abt.core.exchange.grpc.traveller.v1.DeviceAttestationData;

/**
 * Create device attestations using safetynet. Note: testlab does not necessarily support this (devices are rooted).
 */
public class SafetyNetDeviceAttestator extends AbstractDeviceAttestor {

	private static final String TAG = SafetyNetDeviceAttestator.class.getName();

	private final String apiKey;
	private final SafetyNetClient client;
	private final long attestationTimeout;

	public SafetyNetDeviceAttestator(SafetyNetClient client, String apiKey, DeviceDetailsProvider deviceDetailsProvider, long attestationTimeoutMillis) {
		super(deviceDetailsProvider);
		this.client = client;
		this.apiKey = apiKey;
		this.attestationTimeout = attestationTimeoutMillis;
	}

	public AndroidSafetyNetAttestation attest(byte[] serverGeneratedNonce, byte[] signaturePublicKey, byte[] encryptionPublicKey)
			throws DeviceAttestationException {
		DeviceAttestationData attestationData = createAttestationData(serverGeneratedNonce, signaturePublicKey, encryptionPublicKey);

		Log.d(TAG, "Attesting server-generated nonce");

		try {
			Task<SafetyNetApi.AttestationResponse> attestation = client.attest(attestationData.toByteArray(), apiKey);

			Log.d(TAG, "Waiting for attestation");
			SafetyNetApi.AttestationResponse response;
			try {
				response = Tasks.await(attestation, attestationTimeout, TimeUnit.MILLISECONDS);
			} catch (ExecutionException executionException) {
				Throwable cause = executionException.getCause();
				if (cause instanceof DeviceAttestationException && cause.getCause() instanceof ApiException) {
					ApiException apiException = (ApiException) cause.getCause();
					Log.d(TAG, "SafetyNet attestation failed with statusCode: " + apiException.getStatusCode() + ", message: " + apiException.getMessage());
				}
				throw new DeviceAttestationException(cause);
			}

			return createAndroidAttestation(response.getJwsResult());
		} catch (DeviceAttestationException e) {
			throw e;
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new DeviceAttestationException(e);
		} catch (Throwable e) {
			throw new DeviceAttestationException(e);
		}
	}

	@Override
	public boolean supportsAttestation() {
		return true;
	}
}
