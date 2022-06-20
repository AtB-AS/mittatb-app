import { GetFareContractsResponse } from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/traveller/Traveller_API_pb'
import { TokenAction } from '@entur-private/abt-protobuf-js-grpc-node/lib/uk/org/netex/www/netex/uk_org_netex_www_netex_pb'
import {
    UpdateAllowedTokenActionsResponse,
    GetTokenTravelDocumentResponse,
} from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/core/IDToken_Commands_pb'

import {
    AbtTokenServerConfig,
    PendingTokenDetails,
    ActiveTokenDetails,
    ActivateRequest,
    CompleteRequest,
    RemoveResponse,
    KeyValue,
} from '../types'

import { toActiveTokenDetails, toPendingTokenDetails } from './mapper'
import { getMetadataParams } from './metadata'
import { NotFoundError } from './errors'
import {
    activateNewTokenOrCompleteTokenRenewal,
    getTravelDocument,
    getContracts,
    removeToken,
    updateToken,
    getDetails,
    initialize,
    renew,
    connectivityStates,
} from './service'

export { getEnumObjectKeyAsString } from './utils'
export { HttpError } from './errors'

export const createServer = (config: AbtTokenServerConfig) => {
    return {
        async initializeNewMobileToken(
            customerAccountId: string,
            correlationId: string | undefined,
            keyValues: KeyValue[] | undefined,
            allowedActions: TokenAction[] | undefined,
            isEmulator: boolean,
        ): Promise<PendingTokenDetails> {
            const metadata = getMetadataParams(correlationId)
            const { initializationData } = await initialize(
                config,
                customerAccountId,
                keyValues,
                allowedActions,
                metadata,
                isEmulator,
            )

            if (!initializationData) {
                throw new NotFoundError(
                    `Initialization data not found for account id: ${customerAccountId}`,
                )
            }

            return toPendingTokenDetails(initializationData)
        },

        async activateNewMobileToken(
            request: ActivateRequest,
            correlationId?: string,
        ): Promise<ActiveTokenDetails> {
            const metadata = getMetadataParams(correlationId)
            const { tokenDetails } =
                (await activateNewTokenOrCompleteTokenRenewal(config, request, metadata, false)) ||
                {}

            if (!tokenDetails) {
                throw new NotFoundError(
                    `Token details not found after activating initialized token, id: ${request.tokenId}`,
                )
            }

            return toActiveTokenDetails(tokenDetails)
        },

        async initiateMobileTokenRenewal(
            correlationId: string | undefined,
            signedToken: string | undefined,
            reattestation: string | undefined,
            reattestationType: string | undefined,
        ): Promise<PendingTokenDetails> {
            const metadata = getMetadataParams(
                correlationId,
                signedToken,
                reattestation,
                reattestationType,
            )
            const { initializationData } = await renew(config, metadata)

            if (!initializationData) {
                throw new NotFoundError(
                    `Initialization data not found after renewing for signed token: ${signedToken}`,
                )
            }

            return toPendingTokenDetails(initializationData)
        },

        async completeMobileTokenRenewal(
            request: CompleteRequest,
            correlationId: string | undefined,
            signedToken: string | undefined,
            reattestation: string | undefined,
            reattestationType: string | undefined,
        ): Promise<ActiveTokenDetails> {
            const metadata = getMetadataParams(
                correlationId,
                signedToken,
                reattestation,
                reattestationType,
            )
            const { tokenDetails } =
                (await activateNewTokenOrCompleteTokenRenewal(config, request, metadata, true)) ||
                {}

            if (!tokenDetails) {
                throw new NotFoundError(
                    `Token details not found after completing renewed token, id: ${request.tokenId}`,
                )
            }

            return toActiveTokenDetails(tokenDetails)
        },

        async getTokenTravelDocument(
            customerAccountId: string,
            correlationId: string | undefined,
        ): Promise<GetTokenTravelDocumentResponse.AsObject> {
            const metadata = getMetadataParams(correlationId)
            return getTravelDocument(config, customerAccountId, metadata)
        },

        async getMobileTokenDetails(
            correlationId: string | undefined,
            signedToken: string | undefined,
            reattestation: string | undefined,
            reattestationType: string | undefined,
        ): Promise<ActiveTokenDetails> {
            const metadata = getMetadataParams(
                correlationId,
                signedToken,
                reattestation,
                reattestationType,
            )
            const { tokenDetails } = (await getDetails(config, metadata)) || {}

            if (!tokenDetails) {
                throw new NotFoundError(`Token details not found for signed token ${signedToken}`)
            }

            return toActiveTokenDetails(tokenDetails)
        },

        async updateAllowedTokenActions(
            correlationId: string | undefined,
            customerAccountId: string,
            tokenId: string,
            allowedActions: TokenAction[],
        ): Promise<UpdateAllowedTokenActionsResponse.AsObject> {
            const metadata = getMetadataParams(correlationId)
            return updateToken(config, customerAccountId, tokenId, allowedActions, metadata)
        },

        async getFareContracts(
            correlationId: string | undefined,
            signedToken: string | undefined,
            reattestation: string | undefined,
            reattestationType: string | undefined,
        ): Promise<GetFareContractsResponse.AsObject> {
            const metadata = getMetadataParams(
                correlationId,
                signedToken,
                reattestation,
                reattestationType,
            )
            return getContracts(config, metadata)
        },

        async removeTokenFromCustomerAccount(
            customerAccountId: string,
            tokenId: string,
            correlationId: string | undefined,
        ): Promise<RemoveResponse> {
            const metadata = getMetadataParams(correlationId)

            return removeToken(config, customerAccountId, tokenId, metadata)
        },

        async connectivityStates() {
            const metadata = getMetadataParams(undefined)
            return connectivityStates(config, metadata)
        },
    }
}

export type AbtTokenServer = ReturnType<typeof createServer>;
