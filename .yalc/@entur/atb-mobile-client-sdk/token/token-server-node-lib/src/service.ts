import { v4 as uuid } from 'uuid'

import { ServiceError } from '@grpc/grpc-js'

import {
    ActivateNewMobileTokenResponse,
    ActivateNewMobileTokenCommand,
} from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/traveller/TravellerSupport_API_pb'
import {
    KeyValueStructure,
    KeyListStructure,
    TokenRemoveCode,
    TokenUpdateCode,
    TokenAction,
} from '@entur-private/abt-protobuf-js-grpc-node/lib/uk/org/netex/www/netex/uk_org_netex_www_netex_pb'
import {
    MobileTokenActivationDetails,
    KeyAttestation,
} from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/traveller/Traveller_Messages_pb'
import {
    TokenTravelDocumentMetadata,
    CommandId,
} from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/common/Common_Messages_pb'
import {
    CompleteMobileTokenRenewalResponse,
    InitiateMobileTokenRenewalResponse,
    CompleteMobileTokenRenewalCommand,
    InitiateMobileTokenRenewalCommand,
    GetMobileTokenDetailsResponse,
    GetMobileTokenDetailsCommand,
    GetFareContractsResponse,
    GetFareContractsCommand,
} from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/traveller/Traveller_API_pb'
import {
    RemoveIDTokenFromCustomerAccountResponse,
    RemoveIDTokenFromCustomerAccountCommand,
    UpdateAllowedTokenActionsResponse,
    InitializeNewMobileTokenResponse,
    UpdateAllowedTokenActionsCommand,
    InitializeNewMobileTokenCommand,
    GetTokenTravelDocumentResponse,
    GetTokenTravelDocumentCommand,
} from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/core/IDToken_Commands_pb'

import { AbtTokenServerConfig, ActivateRequest, KeyValue, MetadataParams } from '../types'

import { getActivationDetails } from './attestation'
import { GrpcError } from './errors'
import {
    getTravellerSupportServiceClient,
    getCustomerAccountServiceClient,
    getTravellerServiceClient,
} from './serviceClient'

const DEFAULT_ALLOWED_ACTIONS = [
    TokenAction.TOKEN_ACTION_TICKET_TRANSFER,
    TokenAction.TOKEN_ACTION_ADD_REMOVE_TOKEN,
    TokenAction.TOKEN_ACTION_IDENTIFICATION,
    TokenAction.TOKEN_ACTION_TICKET_INSPECTION,
    TokenAction.TOKEN_ACTION_GET_FARECONTRACTS,
    TokenAction.TOKEN_ACTION_CONSUME_ACCESS_RIGHTS,
]

export async function initialize(
    config: AbtTokenServerConfig,
    customerAccountId: string,
    keyValues: KeyValue[] | undefined,
    allowedActions: TokenAction[] | undefined,
    metadataParams: MetadataParams,
    isEmulator: boolean,
): Promise<InitializeNewMobileTokenResponse.AsObject> {
    const { client, metadata } = await getCustomerAccountServiceClient(config, metadataParams)

    const command = new InitializeNewMobileTokenCommand()
        .setCommandId(createCommandId())
        .setTokenId(uuid())
        .setCustomerAccountId(customerAccountId)
        .setValidityDays(30)
        .setRequireAttestation(!isEmulator)
        .setAllowedActionsList(allowedActions || DEFAULT_ALLOWED_ACTIONS)

    if (keyValues) {
        command.setMetadata(
            new TokenTravelDocumentMetadata().setKeyList(
                new KeyListStructure().setKeyValueList(
                    keyValues.map(({ key, value }) =>
                        new KeyValueStructure().setKey(key).setValue(value),
                    ),
                ),
            ),
        )
    }

    return new Promise((resolve, reject) => {
        const callback = getResponseHandler(resolve, reject)
        client.initializeNewMobileToken(command, metadata, callback)
    })
}

export async function renew(
    config: AbtTokenServerConfig,
    metadataParams: MetadataParams,
): Promise<InitiateMobileTokenRenewalResponse.AsObject> {
    const { client, metadata } = await getTravellerServiceClient(config, metadataParams)

    const command = new InitiateMobileTokenRenewalCommand()
        .setCommandId(createCommandId())
        .setNewTokenId(uuid())

    return new Promise((resolve, reject) => {
        const callback = getResponseHandler(resolve, reject)
        client.initiateMobileTokenRenewal(command, metadata, callback)
    })
}

export async function getDetails(
    config: AbtTokenServerConfig,
    metadataParams: MetadataParams,
): Promise<GetMobileTokenDetailsResponse.AsObject> {
    const { client, metadata } = await getTravellerServiceClient(config, metadataParams)

    const command = new GetMobileTokenDetailsCommand().setCommandId(createCommandId())

    return new Promise((resolve, reject) => {
        const callback = getResponseHandler(resolve, reject)
        client.getMobileTokenDetails(command, metadata, callback)
    })
}

export async function getTravelDocument(
    config: AbtTokenServerConfig,
    customerAccountId: string,
    metadataParams: MetadataParams,
): Promise<GetTokenTravelDocumentResponse.AsObject> {
    const { client, metadata } = await getCustomerAccountServiceClient(config, metadataParams)

    const command = new GetTokenTravelDocumentCommand()
        .setCommandId(createCommandId())
        .setCustomerAccountId(customerAccountId)

    return new Promise((resolve, reject) => {
        const callback = getResponseHandler(resolve, reject)
        client.getTokenTravelDocument(command, metadata, callback)
    })
}

export async function activateNewTokenOrCompleteTokenRenewal(
    config: AbtTokenServerConfig,
    {
        commandUuid,
        tokenId,
        attestation,
        attestationType,
        signatureCertificateChain,
        encryptionCertificateChain,
    }: ActivateRequest,
    metadataParams: MetadataParams,
    completeRenewal: boolean,
): Promise<ActivateNewMobileTokenResponse.AsObject> {
    const details = getActivationDetails(config, attestation, attestationType)

    details.setTokenId(tokenId)

    if (signatureCertificateChain) {
        const signaturePublicKeyAttestation = createKeyAttestation(signatureCertificateChain)

        details.getAndroid()?.setSignaturePublicKeyAttestation(signaturePublicKeyAttestation)
    }

    if (encryptionCertificateChain) {
        const encryptionPublicKeyAttestation = createKeyAttestation(encryptionCertificateChain)

        details.getAndroid()?.setEncryptionPublicKeyAttestation(encryptionPublicKeyAttestation)
    }

    return completeRenewal
        ? completeMobileTokenRenewal(config, commandUuid, details, metadataParams)
        : activateNewMobilToken(config, commandUuid, details, metadataParams)
}

export async function getContracts(
    config: AbtTokenServerConfig,
    metadataParams: MetadataParams,
): Promise<GetFareContractsResponse.AsObject> {
    const { client, metadata } = await getTravellerServiceClient(config, metadataParams)

    const command = new GetFareContractsCommand().setCommandId(createCommandId())

    return new Promise((resolve, reject) => {
        const callback = getResponseHandler(resolve, reject)
        client.getFareContracts(command, metadata, callback)
    })
}

export async function removeToken(
    config: AbtTokenServerConfig,
    customerAccountId: string,
    tokenId: string,
    metadataParams: MetadataParams,
): Promise<RemoveIDTokenFromCustomerAccountResponse.AsObject> {
    const { client, metadata } = await getCustomerAccountServiceClient(config, metadataParams)

    const command = new RemoveIDTokenFromCustomerAccountCommand()
        .setCommandId(createCommandId())
        .setTokenId(tokenId)
        .setCustomerAccountId(customerAccountId)
        .setReason(TokenRemoveCode.TOKEN_REMOVE_CODE_REMOVAL_BY_CUSTOMER)

    return new Promise((resolve, reject) => {
        const callback = getResponseHandler(resolve, reject)
        client.removeIDTokenFromCustomerAccount(command, metadata, callback)
    })
}

export async function getTokens(
    config: AbtTokenServerConfig,
    customerAccountId: string,
    metadataParams: MetadataParams,
): Promise<GetTokenTravelDocumentResponse.AsObject> {
    const { client, metadata } = await getCustomerAccountServiceClient(config, metadataParams)

    const command = new GetTokenTravelDocumentCommand()
        .setCommandId(createCommandId())
        .setCustomerAccountId(customerAccountId)

    return new Promise((resolve, reject) => {
        const callback = getResponseHandler(resolve, reject)
        client.getTokenTravelDocument(command, metadata, callback)
    })
}

export async function updateToken(
    config: AbtTokenServerConfig,
    customerAccountId: string,
    tokenId: string,
    allowedActions: TokenAction[],
    metadataParams: MetadataParams,
): Promise<UpdateAllowedTokenActionsResponse.AsObject> {
    const { client, metadata } = await getCustomerAccountServiceClient(config, metadataParams)

    const command = new UpdateAllowedTokenActionsCommand()
        .setCommandId(createCommandId())
        .setTokenId(tokenId)
        .setCustomerAccountId(customerAccountId)
        .setAllowedActionsList(allowedActions)
        .setReason(TokenUpdateCode.TOKEN_UPDATE_CODE_CHANGED_BY_CUSTOMER)

    return new Promise((resolve, reject) => {
        const callback = getResponseHandler(resolve, reject)
        client.updateAllowedTokenActions(command, metadata, callback)
    })
}

async function activateNewMobilToken(
    config: AbtTokenServerConfig,
    commandId: string,
    details: MobileTokenActivationDetails,
    metadataParams: MetadataParams,
): Promise<ActivateNewMobileTokenResponse.AsObject> {
    const { client, metadata } = await getTravellerSupportServiceClient(config, metadataParams)

    const command = new ActivateNewMobileTokenCommand()
        .setCommandId(createCommandId(commandId))
        .setActivationDetails(details)

    return new Promise((resolve, reject) => {
        const callback = getResponseHandler(resolve, reject)
        client.activateNewMobileToken(command, metadata, callback)
    })
}

async function completeMobileTokenRenewal(
    config: AbtTokenServerConfig,
    commandUuid: string,
    details: MobileTokenActivationDetails,
    metadataParams: MetadataParams,
): Promise<CompleteMobileTokenRenewalResponse.AsObject> {
    const { client, metadata } = await getTravellerServiceClient(config, metadataParams)

    const command = new CompleteMobileTokenRenewalCommand()
        .setCommandId(createCommandId(commandUuid))
        .setActivationDetails(details)

    return new Promise((resolve, reject) => {
        const callback = getResponseHandler(resolve, reject)
        client.completeMobileTokenRenewal(command, metadata, callback)
    })
}

export async function connectivityStates(
    config: AbtTokenServerConfig,
    metadataParams: MetadataParams,
) {
    const { client: travellerClient } = await getTravellerServiceClient(config, metadataParams)
    const { client: travellerSupportClient } = await getTravellerSupportServiceClient(
        config,
        metadataParams,
    )
    const { client: customerAccountClient } = await getCustomerAccountServiceClient(
        config,
        metadataParams,
    )

    return {
        traveller: travellerClient.getChannel().getConnectivityState(false),
        travellerSupport: travellerSupportClient.getChannel().getConnectivityState(false),
        customerAccount: customerAccountClient.getChannel().getConnectivityState(false),
    }
}

function createCommandId(commandId?: string): CommandId {
    const id = commandId || uuid()
    return new CommandId().setId(id)
}

function createKeyAttestation(certificateChain: string[]): KeyAttestation {
    return new KeyAttestation().setCertificateChainList(certificateChain)
}

function getResponseHandler<T>(
    resolve: (_: T | PromiseLike<T>) => void,
    reject: (_: GrpcError) => void,
) {
    return (error: ServiceError | null, response: { toObject: () => T | PromiseLike<T> }) =>
        error ? reject(new GrpcError(error)) : resolve(response.toObject())
}
