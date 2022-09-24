import pino from 'pino';
import config from 'config';

export default pino({
  enabled: config.get('app.logger.enabled'),
  level: config.get('app.logger.level'),
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      messageFormat: true
    }
  }
});