import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createLogger, transports, format } from 'winston';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = createLogger({
    transports: [new transports.File({ filename: 'logs.log' })],
    format: format.combine(format.timestamp(), format.json()),
  });

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress;
    const route = req.url;
    this.logger.log({
      level: 'info',
      message: `IP: ${ip}, Route: ${route}`,
    });
    next();
  }
}
