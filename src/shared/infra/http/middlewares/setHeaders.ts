import { Request, Response, NextFunction } from 'express';

export default function setHeaders(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    response.setHeader('Access-Control-Expose-Headers', 'x-total-count');
    next();
}
