import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './errorHandler.js';

export interface JwtPayload {
  sub: string;   // user id
  role: 'student' | 'admin';
  iat: number;
  exp: number;
}

// Extender Request de Express para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Token de autenticacion requerido', 'UNAUTHORIZED');
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    throw new AppError(401, 'Token invalido o expirado', 'INVALID_TOKEN');
  }
}

export function requireRole(role: 'admin') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, 'No autenticado', 'UNAUTHORIZED');
    }
    if (req.user.role !== role) {
      throw new AppError(403, 'Acceso no autorizado', 'FORBIDDEN');
    }
    next();
  };
}
