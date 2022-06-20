import * as Errors from './errors'

type ErrorName = keyof typeof Errors
export const handleRemoteError = (err: any): Promise<never> => {
    if (!err.grpcError?.errorType) throw err

    const errorName = err.grpcError.errorType as ErrorName
    const errorConstructor = Errors[errorName] // TODO: Is this working when minified?

    if (!errorConstructor) throw err

    throw new errorConstructor(err.grpcError.message)
}

// TODO: These are defined in three separate files. Cleanup needed!
export class GrpcError extends Error {
    constructor(message: string, readonly grpcError: GrpcErrorType) {
        super(message)
    }
}

export class ResponseError extends Error {
    constructor(message: string, readonly responseJson: object) {
        super(message)
    }
}

type GrpcErrorDetail = {
    type: string
    value: string | undefined
}

type GrpcErrorType = {
    status: number
    message: string
    grpcErrorCode?: number
    grpcErrorMessage?: string
    grpcErrorDetails: GrpcErrorDetail[]
}
