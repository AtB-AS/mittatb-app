const defaultInfoLogger = (ctx, err, md) => {
  console.log(ctx, err, md);
};

const defaultErrorLogger = (ctx, err, md) => {
  console.error(ctx, err, md);
};

export const logger = {
  info: defaultInfoLogger,
  error: defaultErrorLogger
};
export const setupLogger = ({
  infoLogger,
  errorLogger
}) => {
  if (infoLogger) logger.info = infoLogger;
  if (errorLogger) logger.error = errorLogger;
};
//# sourceMappingURL=logger.js.map