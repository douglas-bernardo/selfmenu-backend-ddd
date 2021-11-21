import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
    url: process.env.REDISCLOUD_URL,
});

const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimit',
    points: 5, // 5 requests
    duration: 1, // per 1 second by IP
});

export default async function rateLimiter(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    try {
        await limiter.consume(request.ip);

        return next();
    } catch (err) {
        console.log(request);
        throw new AppError('Error: Too many requests', 429);
    }
}
