package no.entur.abt.android.token.core.reactnative.mappers;

import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.protobuf.GeneratedMessageLite;

import java.util.List;

import no.entur.abt.android.token.PendingToken;
import no.entur.abt.android.token.TraceMapper;
import no.entur.abt.core.exchange.grpc.traveller.v1.AndroidSafetyNetAttestation;
import no.entur.abt.core.exchange.grpc.traveller.v1.NonceOnlyAttestation;
import uk.org.netex.www.netex.AttestationType;

public abstract class AbstractPendingTokenMapper<T> extends AbstractTokenMapper<T, PendingToken<T>> {

    protected static final String COMMAND_UUID = "commandUuid";
    protected static final String COMMAND_ATTESTATION = "commandAttestation";
    protected static final String COMMAND_ATTESTATION_TYPE = "commandAttestationType";
    protected static final String COMMAND_TRACE = "commandTrace";
    protected static final String SIGNATURE_CERTIFICATE_CHAIN = "signatureCertificateChain";
    protected static final String ENCRYPTION_CERTIFICATE_CHAIN = "encryptionCertificateChain";

    protected static final String TOKEN_SIGNATURE_PUBLIC_KEY = "signaturePublicKey";
    protected static final String TOKEN_ENCRYPTION_PUBLIC_KEY = "encryptionPublicKey";

    @Override
    protected void populateMap(PendingToken<T> token, WritableNativeMap map) {
        super.populateMap(token, map);

        map.putString(COMMAND_UUID, token.getCommandUuid());

        GeneratedMessageLite commandAttestation = token.getCommandAttestation();
        map.putString(COMMAND_ATTESTATION, encode(token.getCommandAttestation().toByteArray()));
        map.putString(COMMAND_ATTESTATION_TYPE, getAttetationType(commandAttestation));

        map.putArray(SIGNATURE_CERTIFICATE_CHAIN, toArray(token.getSignatureCertificateChain()));
        map.putArray(ENCRYPTION_CERTIFICATE_CHAIN, toArray(token.getEncryptionCertificateChain()));

        map.putString(TOKEN_SIGNATURE_PUBLIC_KEY, encode(token.getSignaturePublicKey().getEncoded()));
        map.putString(TOKEN_ENCRYPTION_PUBLIC_KEY, encode(token.getEncryptPublicKey().getEncoded()));
    }

    public static String getAttetationType(GeneratedMessageLite object) {
        // note: do not use class getname becaues of obfuscation
        if (object instanceof NonceOnlyAttestation) {
            return "NonceOnlyAttestation";
        }
        if (object instanceof AndroidSafetyNetAttestation) {
            return "AndroidSafetyNetAttestation";
        }
        throw new IllegalStateException("Unknown attestation type " + object.getClass());
    }

    private WritableNativeArray toArray(List<byte[]> chain) {
        WritableNativeArray result = new WritableNativeArray();

        for(int i = 0; i < chain.size(); i++) {
            result.pushString(encode(chain.get(i)));
        }

        return result;
    }
}
