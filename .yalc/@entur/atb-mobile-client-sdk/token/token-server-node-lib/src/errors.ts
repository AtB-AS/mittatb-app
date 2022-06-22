import type { ServiceError } from '@grpc/grpc-js'
import {
    BadRequest,
    DebugInfo,
    deserializeGrpcStatusDetails,
    ErrorInfo,
    googleDeserializeMap,
    Help,
    LocalizedMessage,
    PreconditionFailure,
    QuotaFailure,
    RequestInfo,
    ResourceInfo,
    RetryInfo,
} from '@stackpath/node-grpc-error-details'

import { MobileTokenReattestationData } from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/common/Common_Messages_pb'
import {
    RemoteTokenStateError,
    TokenEncodingInvalidRemoteTokenStateError,
    TokenMustBeReattestedRemoteTokenStateError,
    TokenMustBeRenewedRemoteTokenStateError,
    TokenMustBeReplacedRemoteTokenStateError,
    TokenNotFoundRemoteTokenStateError,
} from '../../token-state-react-native-lib/src/state/remote/errors'
import {
    ErrorInfoReason,
    PreconditionFailureType,
    TokenInvalidErrorCode,
} from '@entur-private/abt-protobuf-js-grpc-node/lib/no/entur/abt/common/ErrorCode_Messages_pb'
import { getEnumObjectKeyAsString } from './utils'

export class HttpError extends Error {
    status?: number

    constructor(message: string, status?: number) {
        super(message)
        this.status = status
    }

    toJSON = () => ({
        status: this.status,
        message: this.message,
    })
}

export class AuthTokenError extends HttpError {}

export class NotFoundError extends HttpError {
    constructor(message: string) {
        super(message)
        this.status = 404
    }
}

export class InvalidRequestError extends HttpError {
    constructor(message: string) {
        super(message)
        this.status = 400
    }
}

export class GrpcError extends HttpError {
    grpcErrorCode?: number
    grpcErrorMessage?: string
    grpcErrorDetails: Array<{ type: string; value: unknown }>
    errorType: string

    constructor(error: ServiceError) {
        super(error.message)
        this.status = 500
        this.grpcErrorDetails = []

        const grpcErrorDetails = deserializeGrpcStatusDetails(error, deserializeMap)

        this.grpcErrorCode = grpcErrorDetails?.status.getCode()
        this.grpcErrorMessage = grpcErrorDetails?.status.getMessage()
        this.errorType = RemoteTokenStateError.name // TODO: Check if works after minifying?

        grpcErrorDetails?.details.forEach(detail => {
            if (detail instanceof RetryInfo) {
                this.grpcErrorDetails.push({ type: 'RetryInfo', value: detail.toObject() })
            } else if (detail instanceof DebugInfo) {
                this.grpcErrorDetails.push({ type: 'DebugInfo', value: detail.toObject() })
            } else if (detail instanceof QuotaFailure) {
                this.grpcErrorDetails.push({ type: 'QuotaFailure', value: detail.toObject() })
            } else if (detail instanceof BadRequest) {
                this.grpcErrorDetails.push({ type: 'BadRequest', value: detail.toObject() })
            } else if (detail instanceof RequestInfo) {
                this.grpcErrorDetails.push({ type: 'RequestInfo', value: detail.toObject() })
            } else if (detail instanceof ResourceInfo) {
                this.grpcErrorDetails.push({ type: 'ResourceInfo', value: detail.toObject() })
            } else if (detail instanceof Help) {
                this.grpcErrorDetails.push({ type: 'Help', value: detail.toObject() })
            } else if (detail instanceof LocalizedMessage) {
                this.grpcErrorDetails.push({ type: 'LocalizedMessage', value: detail.toObject() })
            } else if (detail instanceof ErrorInfo) {
                this.grpcErrorDetails.push({ type: 'ErrorInfo', value: detail.toObject() })
                this.errorType = getErrorTypeFromErrorInfo(detail)
            } else if (detail instanceof PreconditionFailure) {
                this.grpcErrorDetails.push({
                    type: 'PreconditionFailure',
                    value: detail.toObject(),
                })
                this.errorType = getErrorTypeFromPreconditionFailure(detail)
            } else if (detail instanceof MobileTokenReattestationData) {
                this.grpcErrorDetails.push({
                    type: 'MobileTokenReattestationData',
                    value: Buffer.from(detail.serializeBinary()).toString('base64'),
                })
            }
        })
    }

    toJSON = () => ({
        status: this.status,
        message: this.message,
        grpcErrorCode: this.grpcErrorCode,
        grpcErrorMessage: this.grpcErrorMessage,
        grpcErrorDetails: this.grpcErrorDetails,
        errorType: this.errorType,
    })
}

function getErrorTypeFromErrorInfo(errorInfo: ErrorInfo): string {
    if (
        hasReasonAndErrorCode(
            errorInfo,
            ErrorInfoReason.ERROR_INFO_REASON_TOKEN_INVALID,
            TokenInvalidErrorCode.TOKEN_INVALID_ERROR_CODE_MUST_BE_REPLACED,
        )
    ) {
        return TokenMustBeReplacedRemoteTokenStateError.name
    } else if (
        hasReasonAndErrorCode(
            errorInfo,
            ErrorInfoReason.ERROR_INFO_REASON_TOKEN_INVALID,
            TokenInvalidErrorCode.TOKEN_INVALID_ERROR_CODE_MUST_BE_RENEWED,
        )
    ) {
        return TokenMustBeRenewedRemoteTokenStateError.name
    } else if (
        hasReasonAndErrorCode(
            errorInfo,
            ErrorInfoReason.ERROR_INFO_REASON_TOKEN_INVALID,
            TokenInvalidErrorCode.TOKEN_INVALID_ERROR_CODE_ENCODING_INVALID,
        )
    ) {
        return TokenEncodingInvalidRemoteTokenStateError.name
    } else if (
        hasReasonAndErrorCode(
            errorInfo,
            ErrorInfoReason.ERROR_INFO_REASON_TOKEN_INVALID,
            TokenInvalidErrorCode.TOKEN_INVALID_ERROR_CODE_NOT_FOUND,
        )
    ) {
        return TokenNotFoundRemoteTokenStateError.name
    }
    return RemoteTokenStateError.name
}

function getErrorTypeFromPreconditionFailure(preconditionFailure: PreconditionFailure): string {
    if (
        hasViolation(
            preconditionFailure,
            PreconditionFailureType.PRECONDITION_FAILURE_TYPE_REATTESTATION_REQUIRED,
        )
    ) {
        return TokenMustBeReattestedRemoteTokenStateError.name
    }
    return RemoteTokenStateError.name
}

const hasReasonAndErrorCode = (
    errorInfo: ErrorInfo,
    reason: ErrorInfoReason,
    errorCode: TokenInvalidErrorCode,
) =>
    errorInfo.getReason() === getEnumObjectKeyAsString(ErrorInfoReason, reason) &&
    errorInfo.getMetadataMap().get('errorCode') ===
        getEnumObjectKeyAsString(TokenInvalidErrorCode, errorCode)

const hasViolation = (failure: PreconditionFailure, failureType: PreconditionFailureType) =>
    failure
        .getViolationsList()
        .some(
            violation =>
                violation.getType() ===
                getEnumObjectKeyAsString(PreconditionFailureType, failureType),
        )

const deserializeMap = {
    ...googleDeserializeMap,
    'no.entur.abt.common.v1.MobileTokenReattestationData':
        MobileTokenReattestationData.deserializeBinary,
}
