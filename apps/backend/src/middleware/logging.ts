import { Request, Response, NextFunction } from 'express';

export interface LoggedRequest extends Request {
  requestId?: string;
  startTime?: number;
}

export const loggingMiddleware = (req: LoggedRequest, res: Response, next: NextFunction): void => {
  // Generar ID único para la request
  req.requestId = generateRequestId();
  req.startTime = Date.now();

  // Log de inicio de request
  console.log(JSON.stringify({
    type: 'request_start',
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  }));

  // Interceptar el evento 'finish' de la respuesta
  res.on('finish', () => {
    const duration = Date.now() - (req.startTime || 0);
    
    console.log(JSON.stringify({
      type: 'request_end',
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      timestamp: new Date().toISOString()
    }));
  });

  next();
};

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
