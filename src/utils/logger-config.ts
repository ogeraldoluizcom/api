export const loggerConfig = {
  pinoHttp: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
        singleLine: true,
      },
    },
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
};
