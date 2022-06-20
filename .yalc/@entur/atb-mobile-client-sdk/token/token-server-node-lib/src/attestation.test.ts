import { AttestationType } from '@entur-private/abt-protobuf-js-grpc-node/lib/uk/org/netex/www/netex/uk_org_netex_www_netex_pb'
import {
    AndroidSafetyNetAttestation,
    IOSDeviceCheckResult,
    NonceOnlyAttestation,
} from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/traveller/Traveller_Messages_pb'

import { AbtTokenServerConfig, AttestationType as InternalAttestationType } from '../types'

import { getActivationDetails, getReattestation } from './attestation'
import { InvalidRequestError } from './errors'

const mockedAppleJwt = 'Mocked Apple JWT'
const config = { iosDeviceCheck: {} } as AbtTokenServerConfig

jest.mock('jsonwebtoken', () => ({
    sign: () => mockedAppleJwt,
}))

describe('attestation', () => {
    const serializeMessage = (attestation: { serializeBinary: () => Uint8Array }) =>
        Buffer.from(attestation.serializeBinary()).toString('base64')

    const serializeJSON = (json: Record<string, string>) =>
        Buffer.from(JSON.stringify(json)).toString('base64')

    describe('getActivationDetails', () => {
        it('should get activation details for Android safety net', async () => {
            const attestation = new AndroidSafetyNetAttestation()
            const details = getActivationDetails(
                config,
                serializeMessage(attestation),
                InternalAttestationType.AndroidSafetyNetAttestation,
            )

            expect(details.getAndroid()?.getSafetynet()).toBeDefined()
            expect(details.getIos()).toBeUndefined()
        })

        it('should get activation details for iOS device check', async () => {
            const attestation = new IOSDeviceCheckResult()
            const details = getActivationDetails(
                config,
                serializeMessage(attestation),
                InternalAttestationType.IOSDeviceCheckResult,
            )

            expect(details.getAndroid()).toBeUndefined()
            expect(details.getIos()?.getDeviceCheck()?.getAppleJwtToken()).toEqual(mockedAppleJwt)
            expect(details.getIos()?.getAppAttestAttestation()).toBeUndefined()
        })

        it('should get activation details for iOS app attest', async () => {
            const attestationData = serializeJSON({
                attestationObject: 'ATTESTATION',
                deviceCheckResult: 'RESULT',
            })
            const details = getActivationDetails(
                config,
                attestationData,
                InternalAttestationType.IOSAppAttestAttestation,
            )

            expect(details.getAndroid()).toBeUndefined()
            expect(details.getIos()?.getDeviceCheck()).toBeUndefined()
            expect(details.getIos()?.getAppAttestAttestation()?.getAppleJwtToken()).toEqual(
                mockedAppleJwt,
            )
        })

        it('should get activation details for nonce-only', async () => {
            const attestation = new NonceOnlyAttestation()
            const details = getActivationDetails(
                config,
                serializeMessage(attestation),
                InternalAttestationType.NonceOnlyAttestation,
            )

            expect(details.getAndroid()?.getSafetynet()).toBeUndefined()
            expect(details.getAndroid()?.getNonceOnly()).toBeDefined()
            expect(details.getIos()).toBeUndefined()
        })

        it('should throw an error if attestation type is not supported', async () => {
            const getActivationDetailsFunc = () =>
                getActivationDetails(config, 'Unexpected data', 'Unexpected type')

            expect(getActivationDetailsFunc).toThrow(InvalidRequestError)
        })
    })

    describe('getReattestation', () => {
        it('should get reattestation for Android safety net', async () => {
            const attestation = new AndroidSafetyNetAttestation()
            const reattestation = getReattestation(config, {
                data: serializeMessage(attestation),
                type: InternalAttestationType.AndroidSafetyNetAttestation,
            })

            expect(reattestation.getAndroidSafetynet()).toBeDefined()
            expect(reattestation.getType()).toEqual(
                AttestationType.ATTESTATION_TYPE_ANDROID_SAFETYNET,
            )
        })

        it('should get reattestation for iOS device check', async () => {
            const attestation = new IOSDeviceCheckResult()
            const reattestation = getReattestation(config, {
                data: serializeMessage(attestation),
                type: InternalAttestationType.IOSDeviceCheckResult,
            })

            expect(reattestation.getIosDeviceCheck()).toBeDefined()
            expect(reattestation.getIosAppAttestAssertion()).toBeUndefined()
            expect(reattestation.getType()).toEqual(
                AttestationType.ATTESTATION_TYPE_IOS_DEVICE_CHECK,
            )
        })

        it('should get reattestation for iOS app attest', async () => {
            const attestationData = serializeJSON({
                attestationObject: 'ATTESTATION',
                deviceCheckResult: 'RESULT',
            })
            const reattestation = getReattestation(config, {
                data: attestationData,
                type: InternalAttestationType.IOSAppAttestAssertion,
            })

            expect(reattestation.getIosDeviceCheck()).toBeUndefined()
            expect(reattestation.getIosAppAttestAssertion()).toBeDefined()
            expect(reattestation.getType()).toEqual(AttestationType.ATTESTATION_TYPE_IOS_APP_ATTEST)
        })

        it('should get reattestation for nonce-only', async () => {
            const attestation = new NonceOnlyAttestation()
            const reattestation = getReattestation(config, {
                data: serializeMessage(attestation),
                type: InternalAttestationType.NonceOnlyAttestation,
            })

            expect(reattestation.getAndroidSafetynet()).toBeUndefined()
            expect(reattestation.getNonceOnly()).toBeDefined()
            expect(reattestation.getType()).toEqual(AttestationType.ATTESTATION_TYPE_NONCE_ONLY)
        })

        it('should throw an error if attestation type is not supported', async () => {
            const getReattestationFunc = () =>
                getReattestation(config, { data: 'Unexpected data', type: 'Unexpected type' })

            expect(getReattestationFunc).toThrow(InvalidRequestError)
        })
    })
})
