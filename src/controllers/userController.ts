import { Response, NextFunction } from 'express';
import {
    fetchAllUsers,
    fetchUserById,
    modifyUser,
    removeUser,
} from '../services/userService';
import { AuthRequest, ApiResponse } from '../types';

export const getAllUsers = async (
    _req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
): Promise<void> => {
    try {
        const users = await fetchAllUsers();

        res.status(200).json({
            success: true,
            data: {
                count: users.length,
                users,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await fetchUserById(req.params.id);

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email } = req.body;

        const updateData: { name?: string; email?: string } = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        const user = await modifyUser(req.params.id, updateData);

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await removeUser(req.params.id);

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
