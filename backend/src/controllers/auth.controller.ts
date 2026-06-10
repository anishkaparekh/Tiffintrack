import { Request, Response } from 'express';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { generateAccessToken } from '../utils/jwt';

/**
 * Register a new user.
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists.');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Generate JWT token
  const token = generateAccessToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // TODO: Add notification trigger or welcome mail dispatcher here when business logic is defined.

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      token,
    },
  });
});

/**
 * Login user.
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated.');
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Generate JWT token
  const token = generateAccessToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // TODO: Track login activity/history if required in future analytics specifications.

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      token,
    },
  });
});

/**
 * Logout user.
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // Clear the cookie
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * Get current authenticated user profile.
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // TODO: Retrieve specific business sub-modules depending on the role (e.g. Vendor shop details).

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    },
  });
});
