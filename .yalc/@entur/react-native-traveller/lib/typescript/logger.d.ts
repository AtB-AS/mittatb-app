export declare type LogCallback = (context?: string, error?: Error, metadata?: Record<string, string>) => void;
export declare type Logger = {
    info: LogCallback;
    error: LogCallback;
};
export declare const logger: Logger;
declare type LoggerProps = {
    infoLogger?: LogCallback;
    errorLogger?: LogCallback;
};
export declare const setupLogger: ({ infoLogger, errorLogger }: LoggerProps) => void;
export {};
