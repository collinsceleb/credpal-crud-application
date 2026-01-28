import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: Record<string, unknown>;
    errors?: Record<string, { message: string }>;
}

export const errorHandler = (
    err: CustomError,
    _req: Request,
    res: Response<ApiResponse>,
    _next: NextFunction
): void => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';

    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0];
        message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field'} already exists`;
    }

    if (err.name === 'ValidationError' && err.errors) {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(', ');
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    console.error('Error:', err);

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};
