import 'reflect-metadata';
import 'dotenv/config';

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

/** Connection */
import '@shared/infra/typeorm';

/** Dependency injection */
import '@shared/container';

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(express.json());

/**
 * Access storage files
 */
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

/**
 * celebrate errors middleware
 */
app.use(errors());

/**
 * Middleware Global Exception Handler
 */
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err);
    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

app.listen(3333, () => {
    console.log('🚀️ Server start on port 3333!');
});
