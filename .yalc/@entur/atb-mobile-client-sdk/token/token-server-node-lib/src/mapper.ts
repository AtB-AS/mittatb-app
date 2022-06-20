import { MobileTokenInitializationData } from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/common/Common_Messages_pb'
import { MobileTokenDetails } from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/traveller/Traveller_Messages_pb'

import { ActiveTokenDetails, PendingTokenDetails } from '../types'

export function toPendingTokenDetails(
    initializationData: MobileTokenInitializationData.AsObject,
): PendingTokenDetails {
    const { attestationEncryptionPublicKey, nonce, tokenId, nonceValidityEnd } = initializationData

    return {
        tokenId,
        nonce: String(nonce),
        nonceValidityEnd: nonceValidityEnd?.seconds ?? 0,
        attestationEncryptionPublicKey: String(attestationEncryptionPublicKey),
    }
}

export function toActiveTokenDetails(
    tokenDetails: MobileTokenDetails.AsObject,
): ActiveTokenDetails {
    const { tokenId, signatureCertificate, tokenValidityEnd, tokenValidityStart } = tokenDetails

    return {
        tokenId,
        signatureCertificate: String(signatureCertificate),
        validityEnd: tokenValidityEnd?.seconds ?? 0,
        validityStart: tokenValidityStart?.seconds ?? 0,
    }
}
