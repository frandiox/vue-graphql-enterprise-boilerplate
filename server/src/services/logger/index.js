import { createLogger, format, transports } from 'winston'

class LoggerService {
  constructor() {
    const winstonTransports = [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.timestamp({ format: 'YYYY/MM/DD HH:mm' }),
          format.printf(
            info => `${info.timestamp} - ${info.level}: ${info.message}`
          )
        ),
      }),
    ]

    return createLogger({
      level: 'info',
      transports: winstonTransports,
      exceptionHandlers: winstonTransports,
    })
  }
}

export const logger = new LoggerService() // Default logger
export { LoggerService }
