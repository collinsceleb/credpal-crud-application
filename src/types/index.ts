import { Request, Response, NextFunction } from 'express';
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface AuthRequest extends Request {
    user?: IUser;
}

export interface JwtPayload {
    id: string;
    iat: number;
    exp: number;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

// Express middleware type helper
export type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

export type AuthAsyncHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => Promise<void>;
