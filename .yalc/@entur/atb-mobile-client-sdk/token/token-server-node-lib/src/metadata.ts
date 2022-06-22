import fetch, { BodyInit, Response } from 'node-fetch'
import { v4 as uuid } from 'uuid'

import { Metadata } from '@grpc/grpc-js'

import { AbtTokenServerConfig, AuthTokenResponse, MetadataParams } from '../types'

import { AuthTokenError } from './errors'
import { getReattestation } from './attestation'

export function getMetadataParams(
    correlationId: string | undefined,
    signedToken?: string,
    reattestationData?: string,
    reattestationType?: string,
): MetadataParams {
    const reattestation = reattestationData
        ? { data: reattestationData, type: reattestationType || '' }
        : undefined

    return {
        correlationId: correlationId || uuid(),
        includeAuthorization: false,
        signedToken,
        reattestation,
    }
}

export function createStaticMetadata(config: AbtTokenServerConfig) {
    const metadata = new Metadata()

    metadata.set('x-api-key', config.apiKey)
    metadata.set('Content-Type', 'application/json')

    return metadata
}

export async function createDynamicMetadata(
    config: AbtTokenServerConfig,
    options: MetadataParams,
): Promise<Metadata> {
    const metadata = new Metadata()
    const userAgent = getUserAgent()

    if (userAgent) metadata.set('user-agent', userAgent)

    if (!options) return metadata

    const { correlationId, includeAuthorization, signedToken, reattestation } = options

    if (correlationId) {
        metadata.set('x-correlation-id', correlationId)
    }

    if (includeAuthorization) {
        const token = await getAuthToken(config)

        metadata.set('authorization', `Bearer ${token}`)
    }

    if (signedToken) {
        const signedTokenBin = Buffer.from(signedToken, 'base64')

        metadata.set('signed-token-bin', signedTokenBin)
    }

    if (reattestation) {
        const attestation = getReattestation(config, reattestation)
        const attestationBin = Buffer.from(attestation.serializeBinary())

        metadata.set('attestation-bin', attestationBin)
    }

    return metadata
}

function getUserAgent(): string | undefined {
    /* TODO: Things to include in User Agent:
     * Client name && version && OS?
     * Stub version
     * SDK version
     */

    const userAgent = ['abt-mobile-client-sdk']

    return userAgent.length > 0 ? userAgent.join('-') : undefined
}

async function getAuthToken(config: AbtTokenServerConfig): Promise<string> {
    const response = await post(config.abtTokenHost, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        audience: 'https://v2.api.entur.no',
        grant_type: 'client_credentials',
    })

    if (response.ok) {
        const { access_token: token } = (await response.json()) as AuthTokenResponse

        return token
    }

    throw new AuthTokenError(await response.text())
}

async function post(url: string, body: Record<string, unknown> | BodyInit): Promise<Response> {
    return fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    })
}
