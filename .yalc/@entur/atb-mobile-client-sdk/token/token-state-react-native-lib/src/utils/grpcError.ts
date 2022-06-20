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

export type GrpcErrorDetail = {
    type: string
    value: string | undefined
}

export type GrpcErrorType = {
    status: number
    message: string
    grpcErrorCode?: number
    grpcErrorMessage?: string
    grpcErrorDetails: GrpcErrorDetail[]
}
