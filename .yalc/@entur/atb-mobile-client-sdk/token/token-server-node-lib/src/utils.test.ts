import { ErrorInfoReason } from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/common/ErrorCode_Messages_pb'

import { getEnumObjectKeyAsString } from './utils'

describe('utils', () => {
    describe('getEnumObjectKeyAsString', () => {
        it('should lookup the key of the record', async () => {
            expect(getEnumObjectKeyAsString(ErrorInfoReason, 0)).toEqual(
                'ERROR_INFO_REASON_UNSPECIFIED',
            )
            expect(getEnumObjectKeyAsString(ErrorInfoReason, 1)).toEqual(
                'ERROR_INFO_REASON_TOKEN_INVALID',
            )
            expect(getEnumObjectKeyAsString(ErrorInfoReason, 3)).toEqual(
                'ERROR_INFO_REASON_DEVICE_ATTESTATION_FAILED',
            )
        })
        it('should return an empty string if the lookup fails to find a match', async () => {
            expect(getEnumObjectKeyAsString(ErrorInfoReason, 2)).toEqual('')
        })
    })
})
