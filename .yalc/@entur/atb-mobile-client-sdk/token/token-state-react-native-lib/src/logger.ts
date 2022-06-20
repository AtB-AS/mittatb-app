export type AbtClientInfoLogger = (message: string, metadata?: Record<string, string>) => void

export type ErrorLogger = (error: Error | string, metadata?: Record<string, string>) => void

export type AbtClientLogger = {
    info: (msg: string, metadata?: Record<string, string>) => void
    error: (error: Error | string, metadata?: Record<string, string>) => void
}

export const abtClientLogger: AbtClientLogger = {
    info: (msg, metadata) => console.log(msg, metadata || ''),
    error: (err, metadata) => console.error(err, metadata || ''),
}

export const setupAbtClientLogger = (logger?: AbtClientLogger) => {
    if (logger) {
        abtClientLogger.info = logger.info
        abtClientLogger.error = logger.error
    }
}
