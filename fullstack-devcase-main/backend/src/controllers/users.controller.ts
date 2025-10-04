import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { successResponse, errorResponse } from '../utils/responseHandler';

const usersService = new UsersService();

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await usersService.getAll(req.query as any);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersService.getById(req.params.id);
    return successResponse(res, user);
  } catch (error: any) {
    if (error.message === 'User not found') {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersService.create(req.body);
    return successResponse(res, user, 'User created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersService.update(req.params.id, req.body);
    return successResponse(res, user, 'User updated successfully');
  } catch (error: any) {
    if (error.message === 'User not found') {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await usersService.delete(req.params.id);
    return successResponse(res, result);
  } catch (error: any) {
    if (error.message === 'User not found') {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};