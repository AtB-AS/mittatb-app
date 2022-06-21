import type { Token } from '../../../token-core-javascript-lib/src'

import * as Errors from './errors'
import {
    encodeAsSecureContainer as encodeAsSecureContainerBrige,
    isEmulator as isEmulatorBridge,
} from './TokenCoreBridge'

export enum TokenAction {
    TOKEN_ACTION_UNSPECIFIED = 0,
    TOKEN_ACTION_TICKET_TRANSFER = 1,
    TOKEN_ACTION_ADD_REMOVE_TOKEN = 2,
    TOKEN_ACTION_IDENTIFICATION = 3,
    TOKEN_ACTION_TICKET_INSPECTION = 4,
    TOKEN_ACTION_GET_FARECONTRACTS = 5,
    TOKEN_ACTION_TRAVELCARD = 6,
    TOKEN_ACTION_CONSUME_ACCESS_RIGHTS = 7,
}

type ErrorName = keyof typeof Errors
export const handleNativeError = (err: { code?: string; message: string }): Promise<never> => {
    if (!err.code) throw err
    const errorName = err.code.replace('Exception', 'Error') as ErrorName
    const errorConstructor = Errors[errorName] // Todo: Is this working when minified?
    if (!errorConstructor) throw err
    throw new errorConstructor(err.message)
}

export const encodeAsSecureContainer = (
    token: Token,
    challenges: string[],
    tokenActions: TokenAction[],
    includeCertificate: boolean,
) =>
    encodeAsSecureContainerBrige(
        token.getContextId(),
        token.getTokenId(),
        challenges,
        tokenActions,
        includeCertificate,
    )

export const isEmulator = isEmulatorBridge
