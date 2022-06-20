import { sign } from 'jsonwebtoken'

import { AttestationType } from '@entur-private/abt-protobuf-js-grpc-node/lib/uk/org/netex/www/netex/uk_org_netex_www_netex_pb'
import {
    AndroidMobileTokenActivationDetails,
    IOSMobileTokenActivationDetails,
    MobileTokenActivationDetails,
    AndroidSafetyNetAttestation,
    IOSDeviceCheckAttestation,
    IOSAppAttestAttestation,
    IOSAppAttestAssertion,
    Attestation,
    IOSDeviceCheckResult,
    NonceOnlyAttestation,
} from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/traveller/Traveller_Messages_pb'

import {
    AttestationType as InternalAttestationType,
    AbtTokenServerConfig,
    IOSAppAttestData,
    Reattestation,
} from '../types'

import { InvalidRequestError } from './errors'

export function getActivationDetails(
    config: AbtTokenServerConfig,
    data: string,
    type: string | undefined,
): MobileTokenActivationDetails {
    switch (type) {
        case InternalAttestationType.AndroidSafetyNetAttestation: {
            const safetyNet = toAndroidSafetyNetAttestation(data)
            const androidDetails = new AndroidMobileTokenActivationDetails().setSafetynet(safetyNet)

            return new MobileTokenActivationDetails().setAndroid(androidDetails)
        }

        case InternalAttestationType.IOSDeviceCheckResult: {
            const jwt = getAppleJwt(config)
            const result = toIOSDeviceCheckResult(data)
            const deviceCheck = new IOSDeviceCheckAttestation()
                .setAppleJwtToken(jwt)
                .setDeviceCheckResult(result)

            return new MobileTokenActivationDetails().setIos(
                new IOSMobileTokenActivationDetails().setDeviceCheck(deviceCheck),
            )
        }

        case InternalAttestationType.IOSAppAttestAttestation: {
            const jwt = getAppleJwt(config)
            const { object, deviceCheckResult } = toIOSAppAttestData(data, type)
            const appAttest = new IOSAppAttestAttestation()
                .setAppleJwtToken(jwt)
                .setAttestationObject(object)
                .setDeviceCheckResult(deviceCheckResult)

            return new MobileTokenActivationDetails().setIos(
                new IOSMobileTokenActivationDetails().setAppAttestAttestation(appAttest),
            )
        }

        case InternalAttestationType.NonceOnlyAttestation: {
            const nonceOnly = toNonceOnlyAttestation(data)

            return new MobileTokenActivationDetails().setAndroid(
                new AndroidMobileTokenActivationDetails().setNonceOnly(nonceOnly),
            )
        }

        default:
            throw new InvalidRequestError(
                `Invalid attestation type: "${type}" when trying to deserialize attestation data for ACTIVATION. This type is not supported.`,
            )
    }
}

export function getReattestation(
    config: AbtTokenServerConfig,
    { data, type }: Reattestation,
): Attestation {
    switch (type) {
        case InternalAttestationType.AndroidSafetyNetAttestation: {
            const safetyNet = toAndroidSafetyNetAttestation(data)

            return new Attestation()
                .setAndroidSafetynet(safetyNet)
                .setType(AttestationType.ATTESTATION_TYPE_ANDROID_SAFETYNET)
        }

        case InternalAttestationType.IOSDeviceCheckResult: {
            const jwt = getAppleJwt(config)
            const result = toIOSDeviceCheckResult(data)
            const deviceCheck = new IOSDeviceCheckAttestation()
                .setAppleJwtToken(jwt)
                .setDeviceCheckResult(result)

            return new Attestation()
                .setIosDeviceCheck(deviceCheck)
                .setType(AttestationType.ATTESTATION_TYPE_IOS_DEVICE_CHECK)
        }

        case InternalAttestationType.IOSAppAttestAssertion: {
            const jwt = getAppleJwt(config)
            const { object, deviceCheckResult } = toIOSAppAttestData(data, type)
            const appAttest = new IOSAppAttestAssertion()
                .setAppleJwtToken(jwt)
                .setAssertionObject(object)
                .setDeviceCheckResult(deviceCheckResult)

            return new Attestation()
                .setIosAppAttestAssertion(appAttest)
                .setType(AttestationType.ATTESTATION_TYPE_IOS_APP_ATTEST)
        }

        case InternalAttestationType.NonceOnlyAttestation: {
            const nonceOnly = toNonceOnlyAttestation(data)

            return new Attestation()
                .setNonceOnly(nonceOnly)
                .setType(AttestationType.ATTESTATION_TYPE_NONCE_ONLY)
        }

        default:
            throw new InvalidRequestError(
                `Invalid attestation type: "${type}" when trying to deserialize attestation data for REATTESTATION. This type is not supported.`,
            )
    }
}

function getAppleJwt({ iosDeviceCheck }: AbtTokenServerConfig): string {
    const { issuer, keyid, privateKey } = iosDeviceCheck

    //TODO: Fix correct parsing / handling of date values
    // For current usage of `notBefore` and `expiresIn`, the request fails with:
    // `16 UNAUTHENTICATED: Attestation failed: IOS device check attestation jwt is invalid: The apple jwt token is invalid or expired. IOS device check returned: 401`
    // Probably wrong format ???

    // const validFrom = new Date().getTime()
    // const validUntil = new Date(validFrom + 5 * 60000).getTime() // 5 min

    return sign({}, privateKey, {
        keyid,
        issuer,
        algorithm: 'ES256',
        audience: 'https://appleid.apple.com',
        subject: 'DeviceCheck',
        // notBefore: Math.floor(validFrom / 1000),
        // expiresIn: Math.floor(validUntil / 1000),
    })
}

function toAndroidSafetyNetAttestation(data: string): AndroidSafetyNetAttestation {
    try {
        const buffer = Buffer.from(data, 'base64')

        return AndroidSafetyNetAttestation.deserializeBinary(buffer)
    } catch (e) {
        return handleDeserializationError(e, InternalAttestationType.AndroidSafetyNetAttestation)
    }
}

function toIOSDeviceCheckResult(data: string): IOSDeviceCheckResult {
    try {
        const buffer = Buffer.from(data, 'base64')

        return IOSDeviceCheckResult.deserializeBinary(buffer)
    } catch (e) {
        return handleDeserializationError(e, InternalAttestationType.IOSDeviceCheckResult)
    }
}

function toIOSAppAttestData(
    data: string,
    type:
        | InternalAttestationType.IOSAppAttestAttestation
        | InternalAttestationType.IOSAppAttestAssertion,
): IOSAppAttestData {
    try {
        const buffer = Buffer.from(data, 'base64').toString()

        return JSON.parse(buffer)
    } catch (e) {
        return handleDeserializationError(e, type)
    }
}

function toNonceOnlyAttestation(data: string): NonceOnlyAttestation {
    try {
        const buffer = Buffer.from(data, 'base64')

        return NonceOnlyAttestation.deserializeBinary(buffer)
    } catch (e) {
        return handleDeserializationError(e, InternalAttestationType.NonceOnlyAttestation)
    }
}

function handleDeserializationError<T>(e: unknown, attestationType: InternalAttestationType): T {
    throw new InvalidRequestError(
        `Could not deserialize attestation data as: ${attestationType}. Error: ${JSON.stringify(
            e,
        )}`,
    )
}
