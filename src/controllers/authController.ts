import { Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { AuthRequest, ApiResponse } from '../types';

export const register = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        const { user, token } = await registerUser(name, email, password);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });
    } catch (error: any) {
        if (error.message === 'User with this email already exists') {
            res.status(400).json({
                success: false,
                error: error.message,
            });
            return;
        }
        next(error);
    }
};

export const login = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: 'Please provide email and password',
            });
            return;
        }

        const { user, token } = await loginUser(email, password);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });
    } catch (error: any) {
        if (error.message === 'Invalid credentials') {
            res.status(401).json({
                success: false,
                error: error.message,
            });
            return;
        }
        next(error);
    }
};

export const getMe = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    _next: NextFunction
): Promise<void> => {
    const user = req.user;

    res.status(200).json({
        success: true,
        data: {
            user: {
                id: user?._id,
                name: user?.name,
                email: user?.email,
                createdAt: user?.createdAt,
                updatedAt: user?.updatedAt,
            },
        },
    });
};
