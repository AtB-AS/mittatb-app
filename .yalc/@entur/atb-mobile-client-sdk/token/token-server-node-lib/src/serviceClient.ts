import { Metadata, credentials, ChannelCredentials } from '@grpc/grpc-js'

import { TravellerSupportServiceClient } from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/traveller/TravellerSupport_API_grpc_pb'
import { CustomerAccountServiceClient } from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/core/CustomerAccount_API_grpc_pb'
import { TravellerServiceClient } from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/traveller/Traveller_API_grpc_pb'

import { AbtTokenServerConfig, MetadataParams } from '../types'

import { createDynamicMetadata, createStaticMetadata } from './metadata'

interface ClientAndMetadata<ClientType> {
    client: ClientType
    metadata: Metadata
}

let travellerSupportServiceClient: TravellerSupportServiceClient | undefined
let customerAccountServiceClient: CustomerAccountServiceClient | undefined
let travellerServiceClient: TravellerServiceClient | undefined
let channelCredentials: Promise<ChannelCredentials> | undefined

export async function getTravellerSupportServiceClient(
    config: AbtTokenServerConfig,
    metadataParams: MetadataParams,
): Promise<ClientAndMetadata<TravellerSupportServiceClient>> {
    const creds = await getChannelCredentials(config)

    travellerSupportServiceClient =
        travellerSupportServiceClient || new TravellerSupportServiceClient(config.abtHost, creds)

    return {
        client: travellerSupportServiceClient,
        metadata: await createDynamicMetadata(config, metadataParams),
    }
}

export async function getCustomerAccountServiceClient(
    config: AbtTokenServerConfig,
    metadataParams: MetadataParams,
): Promise<ClientAndMetadata<CustomerAccountServiceClient>> {
    const creds = await getChannelCredentials(config)

    customerAccountServiceClient =
        customerAccountServiceClient || new CustomerAccountServiceClient(config.abtHost, creds)

    return {
        client: customerAccountServiceClient,
        metadata: await createDynamicMetadata(config, {
            ...metadataParams,
            includeAuthorization: true,
        }),
    }
}

export async function getTravellerServiceClient(
    config: AbtTokenServerConfig,
    metadataParams: MetadataParams,
): Promise<ClientAndMetadata<TravellerServiceClient>> {
    const creds = await getChannelCredentials(config)

    travellerServiceClient =
        travellerServiceClient || new TravellerServiceClient(config.abtHost, creds)

    return {
        client: travellerServiceClient,
        metadata: await createDynamicMetadata(config, metadataParams),
    }
}

async function getChannelCredentials(config: AbtTokenServerConfig): Promise<ChannelCredentials> {
    if (channelCredentials) return channelCredentials

    return credentials.combineChannelCredentials(
        credentials.createSsl(),
        credentials.createFromMetadataGenerator((_, callback) =>
            callback(null, createStaticMetadata(config)),
        ),
    )
}
