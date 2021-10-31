import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';

export default function appAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('Owner is missing', 401);
    }

    const [, owner_id] = authHeader.split(' ');

    request.account = {
        id: owner_id,
    };

    return next();
}
