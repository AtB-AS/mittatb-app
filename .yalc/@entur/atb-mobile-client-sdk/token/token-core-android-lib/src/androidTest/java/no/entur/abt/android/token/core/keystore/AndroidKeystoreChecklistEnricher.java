package no.entur.abt.android.token.core.keystore;

import static java.nio.charset.StandardCharsets.UTF_8;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.math.BigInteger;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.locks.ReentrantLock;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

import no.entur.abt.android.token.DefaultTokenContext;
import no.entur.abt.android.token.TokenContext;
import no.entur.abt.android.token.core.Check;
import no.entur.abt.android.token.core.Checklist;
import no.entur.abt.android.token.core.KeyAttestationWhitelistEntry;
import no.entur.abt.android.token.keystore.DefaultTokenKeyStore;
import no.entur.abt.android.token.keystore.TokenTrustChain;

public class AndroidKeystoreChecklistEnricher {

	private static final String LOG_TAG = AndroidKeystoreChecklistEnricher.class.getName();

	private final CertificateFactory certificateFactory;

	protected TokenContext tokenContext = new DefaultTokenContext("entur", new ReentrantLock());

	protected AndroidCertificateRevocationStatusService revocationStatusService;

	protected DefaultTokenKeyStore<Object> tokenKeyStore;

	protected Set<X509Certificate> acceptableRootCertificates;

	protected BouncyCastleProvider provider = new BouncyCastleProvider();

	public void loadRootCertificates() throws CertificateException {
		acceptableRootCertificates = new HashSet<>();
		for (String googleRootCertificate : AndroidKeyAttestationConstants.GOOGLE_ROOT_CERTIFICATES) {
			X509Certificate secureRoot = (X509Certificate) CertificateFactory.getInstance("X.509")
					.generateCertificate(new ByteArrayInputStream(googleRootCertificate.getBytes(UTF_8)));
			acceptableRootCertificates.add(secureRoot);
		}
	}

	public AndroidKeystoreChecklistEnricher(DefaultTokenKeyStore<Object> tokenKeyStore, Context context) throws CertificateException, IOException {
		this.tokenKeyStore = tokenKeyStore;
		this.revocationStatusService = new AndroidCertificateRevocationStatusService(context);

		loadRootCertificates();

		certificateFactory = CertificateFactory.getInstance("X.509", provider);
	}

	public void enrich(KeyAttestationWhitelistEntry entry, Checklist report, Instant time) {
		try {
			String tokenId = UUID.randomUUID().toString();

			byte[] challenge = new byte[] { 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F };

			report(entry, report, time, challenge, getSignatureTokenTrustChain(tokenId, challenge), "keystore.signature.");
			report(entry, report, time, challenge, getEncryptionTrustChain(tokenId, challenge), "keystore.encryption.");
		} catch (Exception e) {
			Log.d(LOG_TAG, "Problem generation report", e);
			report.add(new Check("keystore.general", null, false, e));
		}
	}

	@NonNull
	private TokenTrustChain getSignatureTokenTrustChain(String tokenId, byte[] challenge) throws no.entur.abt.android.token.keystore.TokenKeystoreException {
		return getTokenTrustChain(tokenKeyStore.createSignatureKey(tokenContext, tokenId, challenge));
	}

	@NonNull
	private TokenTrustChain getEncryptionTrustChain(String tokenId, byte[] challenge) throws no.entur.abt.android.token.keystore.TokenKeystoreException {
		return getTokenTrustChain(tokenKeyStore.createEncryptionKey(tokenContext, tokenId, challenge));
	}

	@NonNull
	private TokenTrustChain getTokenTrustChain(TokenTrustChain tokenTrustChain) {
		byte[] publicEncoded = tokenTrustChain.getPublicEncoded();

		List<byte[]> serializedCertificateChain = new ArrayList<>(tokenTrustChain.getCertificateChain());
		serializedCertificateChain.add(0, publicEncoded);
		return tokenTrustChain;
	}

	private void report(KeyAttestationWhitelistEntry entry, Checklist report, Instant time, byte[] challenge, TokenTrustChain tokenTrustChain, String prefix) {

		// KEY_ATTESTATION_LEVEL_NONE if
		// * empty chain
		// * parse error
		// * not valid key chain (invalid or revoked)
		//
		// KEY_ATTESTATION_LEVEL_SOFTWARE if
		// * root certificate not among known Google Root Certificates list
		// * certificate is among root certificates, but AttestationRecord says trust software
		//
		// KEY_ATTESTATION_LEVEL_HARDWARE if
		// * root certificate is among root certificates, but AttestationRecord says TRUSTED_ENVIRONMENT or STRONG_BOX software
		//
		//

		List<byte[]> chain = tokenTrustChain.getCertificateChain();
		if (chain == null || chain.isEmpty()) {
			Log.d(LOG_TAG, "Empty keychain");

			report.add(new Check(prefix + "keychain.parse", "empty", false, null));

			entry.setRequired_key_attestation_level(KeyAttestationWhitelistEntry.KEY_ATTESTATION_LEVEL_NONE);

			return;
		}

		try {
			Log.d(LOG_TAG, "Attempt to parse certificate chain size " + chain.size());

			List<X509Certificate> certificateChain = parseCertificateChain(report, prefix, chain, 0);

			if (certificateChain.size() == chain.size()) {
				report.add(new Check(prefix + "keychain.parse", certificateChain.size()));

				verifyCertificateChain(entry, prefix, report, certificateChain, time, challenge);
			} else {
				Log.d(LOG_TAG, "Could only parse " + (chain.size() - certificateChain.size()) + " of " + chain.size() + " certificates");
				report.add(new Check(prefix + "keychain.parse", null, false, null));

				entry.setRequired_key_attestation_level(KeyAttestationWhitelistEntry.KEY_ATTESTATION_LEVEL_NONE);
			}
		} catch (Exception e) {
			Log.d(LOG_TAG, "Problem with certificate chain", e);

			report.add(new Check(prefix + "keychain.parse", null, false, e));

			entry.setRequired_key_attestation_level(KeyAttestationWhitelistEntry.KEY_ATTESTATION_LEVEL_NONE);
		}
	}

	private X509Certificate parseCertificate(byte[] bytes) throws CertificateException {
		return (X509Certificate) certificateFactory.generateCertificate(new ByteArrayInputStream(bytes));
	}

	private List<X509Certificate> parseCertificateChain(Checklist report, String prefix, List<byte[]> encodedCertificates, int fromIndex) {
		List<X509Certificate> certificates = new ArrayList<>();

		for (int i = fromIndex; i < encodedCertificates.size(); i++) {
			byte[] encodedCertificate = encodedCertificates.get(i);

			if (encodedCertificate == null || encodedCertificate.length == 0) {
				report.add(new Check(prefix + "keychain." + i + ".parse", "empty", false, null));
				Log.d(LOG_TAG, "Empty certificate at " + i);

				continue;
			}
			try {
				X509Certificate certificate = parseCertificate(encodedCertificate);
				certificates.add(certificate);
				Log.d(LOG_TAG, "Parsed certificate " + i + ": " + certificate.toString());

				report.add(new Check(prefix + "keychain." + i + ".parse", null));
			} catch (Exception e) {
				Log.d(LOG_TAG, "Problem parsing certificate from bytes " + encodedCertificate.length, e);
				report.add(new Check(prefix + "keychain." + i + ".parse", null, false, e));
			}
		}
		return certificates;

	}

	private void verifyCertificateChain(KeyAttestationWhitelistEntry entry, String prefix, Checklist report, List<X509Certificate> certs, Instant time,
			byte[] challenge) {

		String keyAttestationLevel;
		boolean rootCertificateIsSecure = acceptableRootCertificates.stream()
				.anyMatch(secureRoot -> Arrays.equals(secureRoot.getPublicKey().getEncoded(), certs.get(certs.size() - 1).getPublicKey().getEncoded()));

		if (rootCertificateIsSecure) {
			report.add(new Check(prefix + "keychain.root-certificate.secure", null));

			// check attestation record
			try {
				ParsedAttestationRecord parsedAttestationRecord = ParsedAttestationRecord.createParsedAttestationRecord(certs.get(0));
				report.add(new Check(prefix + "keychain.attestation-record.parse", null));

				if (Arrays.equals(parsedAttestationRecord.attestationChallenge, challenge)) {
					report.add(new Check(prefix + "keychain.attestation-record.challenge", null));
				} else {
					report.add(new Check(prefix + "keychain.attestation-record.challenge", null, false, null));
				}

				boolean hardwareAttestationSecurityLevel = parsedAttestationRecord.attestationSecurityLevel == ParsedAttestationRecord.SecurityLevel.TRUSTED_ENVIRONMENT
						|| parsedAttestationRecord.attestationSecurityLevel == ParsedAttestationRecord.SecurityLevel.STRONG_BOX;
				boolean softwareAttestationSecurityLevel = parsedAttestationRecord.attestationSecurityLevel == ParsedAttestationRecord.SecurityLevel.SOFTWARE;
				// Verify that attestation and keymaster is both from Strong box / HW
				Log.d(LOG_TAG, "Attestation security level is " + parsedAttestationRecord.attestationSecurityLevel);
				if (hardwareAttestationSecurityLevel) {
					report.add(new Check(prefix + "keychain.attestation-record.attestation-security-level", parsedAttestationRecord.attestationSecurityLevel));
				} else if (softwareAttestationSecurityLevel) {
					report.add(new Check(prefix + "keychain.attestation-record.attestation-security-level", parsedAttestationRecord.attestationSecurityLevel,
							false, null));
				} else {
					throw new RuntimeException("Unknown attestation security level " + parsedAttestationRecord.attestationSecurityLevel);
				}

				Log.d(LOG_TAG, "Keymaster security level is " + parsedAttestationRecord.keymasterSecurityLevel);
				boolean hardwareKeymasterSecurityLevel = parsedAttestationRecord.keymasterSecurityLevel == ParsedAttestationRecord.SecurityLevel.TRUSTED_ENVIRONMENT
						|| parsedAttestationRecord.keymasterSecurityLevel == ParsedAttestationRecord.SecurityLevel.STRONG_BOX;

				boolean softwareKeymasterSecurityLevel = parsedAttestationRecord.keymasterSecurityLevel == ParsedAttestationRecord.SecurityLevel.SOFTWARE;
				if (hardwareKeymasterSecurityLevel) {
					report.add(new Check(prefix + "keychain.attestation-record.keymaster-security-level", parsedAttestationRecord.keymasterSecurityLevel));
				} else if (softwareKeymasterSecurityLevel) {
					report.add(new Check(prefix + "keychain.attestation-record.keymaster-security-level", parsedAttestationRecord.keymasterSecurityLevel, false,
							null));
				} else {
					throw new RuntimeException("Unknown keymaster security level " + parsedAttestationRecord.attestationSecurityLevel);
				}

				if (hardwareKeymasterSecurityLevel && hardwareAttestationSecurityLevel) {
					keyAttestationLevel = KeyAttestationWhitelistEntry.KEY_ATTESTATION_LEVEL_HARDWARE;
				} else if (softwareKeymasterSecurityLevel || softwareAttestationSecurityLevel) {
					keyAttestationLevel = KeyAttestationWhitelistEntry.KEY_ATTESTATION_LEVEL_SOFTWARE;
				} else {
					throw new RuntimeException();
				}

			} catch (Exception e) {
				Log.d(LOG_TAG, "Problem parsing attestation record", e);

				report.add(new Check(prefix + "keychain.attestation-record.parse", null, false, e));

				keyAttestationLevel = KeyAttestationWhitelistEntry.KEY_ATTESTATION_LEVEL_NONE; // XXX
			}
		} else {
			report.add(new Check(prefix + "keychain.root-certificate.secure", null, false, null));

			keyAttestationLevel = KeyAttestationWhitelistEntry.KEY_ATTESTATION_LEVEL_SOFTWARE;
		}

		boolean validity = true;

		List<X509Certificate> reversed = new ArrayList<>(certs);
		Collections.reverse(reversed);

		X509Certificate parent = reversed.get(0); // i.e. the root certificate above
		for (int i = 0; i < reversed.size(); i++) {
			X509Certificate cert = reversed.get(i);

			// Software attestation certificates tend to be expired since 1970. Not sure this should be handled by same prop as controls whether hw is required
			// but will accept expired certificates for sw attestation for now
			// Verify that the certificate has not expired.
			try {
				cert.checkValidity(Date.from(time));

				report.add(new Check(prefix + "keychain." + i + ".validity", cert.getSerialNumber()));
			} catch (Exception e) {
				Log.d(LOG_TAG, "Problem checking validity", e);
				report.add(new Check(prefix + "keychain." + i + ".validity", cert.getSerialNumber(), false, e));

				validity = false;
			}

			try {
				cert.verify(parent.getPublicKey()); // Note: the root certificate checks it self, which is fair.

				report.add(new Check(prefix + "keychain." + i + ".verify", cert.getSerialNumber()));
			} catch (Exception e) {
				Log.d(LOG_TAG, "Problem verifying public key", e);
				report.add(new Check(prefix + "keychain." + i + ".verify", cert.getSerialNumber(), false, e));

				keyAttestationLevel = KeyAttestationWhitelistEntry.KEY_ATTESTATION_LEVEL_NONE;
			}

			CertificateRevocationStatus certStatus = revocationStatusService.getStatus(cert.getSerialNumber());

			if (certStatus == null) {
				report.add(new Check(prefix + "keychain." + i + ".revoke", null));
			} else {
				keyAttestationLevel = KeyAttestationWhitelistEntry.KEY_ATTESTATION_LEVEL_NONE;

				report.add(new Check(prefix + "keychain." + i + ".revoke", certStatus.status.name(), false, null));
			}

			parent = cert;
		}

		entry.setVerify_certificate_validity(validity);
		entry.setRequired_key_attestation_level(keyAttestationLevel);
	}

	public static String toString(BigInteger bigInteger) throws IOException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		ObjectOutputStream outputStream = new ObjectOutputStream(baos);
		outputStream.writeObject(bigInteger);
		byte[] rawBytes = baos.toByteArray();

		return Base64.getEncoder().encodeToString(rawBytes);
	}
}
