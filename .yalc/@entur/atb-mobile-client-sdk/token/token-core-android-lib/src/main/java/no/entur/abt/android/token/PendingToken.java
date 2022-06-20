package no.entur.abt.android.token;

import java.security.KeyPair;
import java.util.List;

import com.google.protobuf.GeneratedMessageLite;

/**
 *
 * A token which has been initiated (token id and nonce is known to the server), but not activated.
 *
 */

public class PendingToken<T> extends Token<T> {

	// store enough context fields so that the resulting GRPC request can be reconstructed
	private String commandUuid = null;
	private GeneratedMessageLite commandAttestation = null;
	private T commandTrace;
	// assume trust chains are deterministic and can be loaded on demand

	private List<byte[]> signatureCertificateChain;
	private List<byte[]> encryptionCertificateChain;

	public PendingToken(String tokenId, KeyPair signatureKey, KeyPair encryptKey, TokenEncoder tokenEncoder, int strainNumber, String pendingCommandUUID,
			GeneratedMessageLite pendingCommandAttestation, List<byte[]> signatureCertificateChain, List<byte[]> encryptionCertificateChain, T commandTrace,
			TokenContext<T> tokenContext) {
		super(tokenId, signatureKey, encryptKey, tokenEncoder, strainNumber, tokenContext);

		this.commandUuid = pendingCommandUUID;
		this.commandAttestation = pendingCommandAttestation;

		this.signatureCertificateChain = signatureCertificateChain;
		this.encryptionCertificateChain = encryptionCertificateChain;

		this.commandTrace = commandTrace;
	}

	public String getCommandUuid() {
		return commandUuid;
	}

	public GeneratedMessageLite getCommandAttestation() {
		return commandAttestation;
	}

	public List<byte[]> getSignatureCertificateChain() {
		return signatureCertificateChain;
	}

	public List<byte[]> getEncryptionCertificateChain() {
		return encryptionCertificateChain;
	}

	@Override
	protected KeyPair getEncryptKey() {
		return super.getEncryptKey();
	}

	public T getCommandTrace() {
		return commandTrace;
	}
}
