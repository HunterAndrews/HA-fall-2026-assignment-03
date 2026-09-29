import { Request, Response, NextFunction } from 'express';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // TODO: Student implementation - Part 1: Authentication Middleware
  const userIdHeader = req.header('X-User-Id'); // req.header returns value of header

  if (!userIdHeader || userIdHeader.trim() === '') {  // if userId is not set or is empty, send unauthorized
    res.status(401).send('Unauthorized');
    return;
  }

  const userId = Number(userIdHeader);

  if (!Number.isFinite(userId)) {  // if userId is not set or is empty, send unauthorized
    res.status(401).send('Unauthorized');
    return;
  }

  res.locals.userId = userId;
  next();
}

// TODO: Student implementation - Part 2: Authorization Middleware
export function authzMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  next();
}

export default authMiddleware;
