export type LogCallback = (
  context?: string,
  error?: Error,
  metadata?: Record<string, string>
) => void;

export type Logger = {
  info: LogCallback;
  error: LogCallback;
};

const defaultInfoLogger: LogCallback = (
  ctx?: string,
  err?: Error,
  md?: Record<string, string>
) => {
  console.log(ctx, err, md);
};

const defaultErrorLogger: LogCallback = (
  ctx?: string,
  err?: Error,
  md?: Record<string, string>
) => {
  console.error(ctx, err, md);
};

export const logger: Logger = {
  info: defaultInfoLogger,
  error: defaultErrorLogger,
};

type LoggerProps = {
  infoLogger?: LogCallback;
  errorLogger?: LogCallback;
};

export const setupLogger = ({ infoLogger, errorLogger }: LoggerProps) => {
  if (infoLogger) logger.info = infoLogger;
  if (errorLogger) logger.error = errorLogger;
};
