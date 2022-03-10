"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupLogger = exports.logger = void 0;

const defaultInfoLogger = (ctx, err, md) => {
  console.log(ctx, err, md);
};

const defaultErrorLogger = (ctx, err, md) => {
  console.error(ctx, err, md);
};

const logger = {
  info: defaultInfoLogger,
  error: defaultErrorLogger
};
exports.logger = logger;

const setupLogger = ({
  infoLogger,
  errorLogger
}) => {
  if (infoLogger) logger.info = infoLogger;
  if (errorLogger) logger.error = errorLogger;
};

exports.setupLogger = setupLogger;
//# sourceMappingURL=logger.js.map