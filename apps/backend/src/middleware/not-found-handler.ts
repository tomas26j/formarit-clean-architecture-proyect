import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      message: `Ruta no encontrada: ${req.method} ${req.url}`,
      code: 'NOT_FOUND',
      timestamp: new Date().toISOString(),
      path: req.url
    }
  });
};
