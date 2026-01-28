import { Response, NextFunction } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest, ApiResponse } from '../types';

export const register = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'User with this email already exists',
            });
            return;
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        const token = generateToken(user._id.toString());

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
    } catch (error) {
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

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
            return;
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
            return;
        }

        const token = generateToken(user._id.toString());

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
    } catch (error) {
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
