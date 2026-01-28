import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Not authorized to access this route',
            });
            return;
        }

        try {
            const decoded = verifyToken(token);

            const user = await User.findById(decoded.id);

            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }

            req.user = user;
            next();
        } catch {
            res.status(401).json({
                success: false,
                error: 'Token is invalid or expired',
            });
            return;
        }
    } catch (error) {
        next(error);
    }
};
