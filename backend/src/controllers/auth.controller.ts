import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { generateAccessToken } from '../utils/jwt';
import { NotificationService } from '../services/notification.service';

/**
 * Register a new user.
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { 
    name, 
    email, 
    password, 
    role,
    phone,
    businessName,
    kitchenAddress,
    city,
    mealsPerDay,
    description
  } = req.body;

  console.log(`[Auth Audit] API request received: Signup request received for email: ${email}, role: ${role}`);

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.warn(`[Auth Audit] User signup failure: Email ${email} already exists.`);
    throw new ApiError(400, 'User with this email already exists.');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    businessName,
    kitchenAddress,
    city,
    mealsPerDay: mealsPerDay ? Number(mealsPerDay) : undefined,
    description,
    verificationStatus: role === 'vendor' ? 'pending' : undefined,
  });

  console.log(`[Auth Audit] User created: SUCCESS. User created with ID: ${user._id}, email: ${user.email}`);

  // Trigger Notification to Admins if a Vendor registers
  if (role === 'vendor') {
    await NotificationService.createSystemNotificationForAdmins(
      '🆕 New Vendor Registered',
      `Chef "${name}" has registered the kitchen "${businessName || 'Unnamed Kitchen'}" and is pending verification.`,
      { vendorId: user._id, email }
    );
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
        verificationStatus: user.verificationStatus,
        phone: user.phone,
        businessName: user.businessName,
        kitchenAddress: user.kitchenAddress,
        city: user.city,
        mealsPerDay: user.mealsPerDay,
        description: user.description,
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

  console.log(`[Auth Audit] API request received: Login request received for email: ${email}`);

  // Predefined demo accounts check (Mock Auth Mode)
  const trimmedEmail = email ? email.trim().toLowerCase() : '';
  const trimmedPassword = password ? password.trim() : '';

  if (
    (trimmedEmail === 'customer@demo.com' && trimmedPassword === 'password123') ||
    (trimmedEmail === 'vendor@demo.com' && trimmedPassword === 'password123') ||
    (trimmedEmail === 'admin@demo.com' && trimmedPassword === 'password123')
  ) {
    let mockRole: 'customer' | 'vendor' | 'admin' = 'customer';
    let mockName = 'Demo Customer';
    
    if (trimmedEmail === 'vendor@demo.com') {
      mockRole = 'vendor';
      mockName = 'Demo Vendor';
    } else if (trimmedEmail === 'admin@demo.com') {
      mockRole = 'admin';
      mockName = 'Demo Admin';
    }

    const mockId = new mongoose.Types.ObjectId().toString();
    const token = generateAccessToken({
      id: mockId,
      email: trimmedEmail,
      role: mockRole,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    console.log(`[Auth Audit] Mock login success for email: ${trimmedEmail}, role: ${mockRole}`);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully (Mock Auth Mode)',
      data: {
        user: {
          id: mockId,
          name: mockName,
          email: trimmedEmail,
          role: mockRole,
          isActive: true,
          verificationStatus: mockRole === 'vendor' ? 'verified' : undefined,
          phone: '1234567890',
          businessName: mockRole === 'vendor' ? 'Demo Kitchen' : undefined,
          kitchenAddress: mockRole === 'vendor' ? '123 Chef Street' : undefined,
          city: 'Mumbai',
          description: 'Predefined dev demo session',
        },
        token,
      },
    });
  }

  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    console.warn(`[Auth Audit] User login failure: Email ${email} not found.`);
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Check if user is active
  if (!user.isActive) {
    console.warn(`[Auth Audit] User login failure: Account for ${email} is inactive.`);
    throw new ApiError(403, 'Your account has been deactivated.');
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    console.warn(`[Auth Audit] User login failure: Invalid password for ${email}.`);
    throw new ApiError(401, 'Invalid email or password.');
  }

  console.log(`[Auth Audit] User login success for email: ${email}, role: ${user.role}`);

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

  return res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        verificationStatus: user.verificationStatus,
        phone: user.phone,
        businessName: user.businessName,
        kitchenAddress: user.kitchenAddress,
        city: user.city,
        description: user.description
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
        verificationStatus: user.verificationStatus,
        phone: user.phone,
        businessName: user.businessName,
        kitchenAddress: user.kitchenAddress,
        city: user.city,
        description: user.description
      },
    },
  });
});

/**
 * Register a new delivery partner.
 * POST /api/v1/auth/delivery/register
 */
export const deliveryRegister = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, vehicleType, vehicleNumber } = req.body;

  console.log(`[Auth Audit] Delivery register request received for email: ${email}`);

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.warn(`[Auth Audit] Delivery signup failure: Email ${email} already exists.`);
    throw new ApiError(400, 'User with this email already exists.');
  }

  // Create delivery partner
  const user = await User.create({
    name,
    email,
    password,
    role: 'deliveryPartner',
    phone,
    vehicleType,
    vehicleNumber,
    isActive: true
  });

  console.log(`[Auth Audit] Delivery partner created: SUCCESS. ID: ${user._id}`);

  // Generate JWT token
  const token = generateAccessToken({
    id: user._id.toString(),
    email: user.email,
    role: 'deliveryPartner',
  });

  // Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(201).json({
    success: true,
    message: 'Delivery partner registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        phone: user.phone,
        vehicleType: user.vehicleType,
        vehicleNumber: user.vehicleNumber,
        createdAt: user.createdAt,
      },
      token,
    },
  });
});

/**
 * Login delivery partner.
 * POST /api/v1/auth/delivery/login
 */
export const deliveryLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log(`[Auth Audit] Delivery login request received for email: ${email}`);

  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || user.role !== 'deliveryPartner') {
    console.warn(`[Auth Audit] Delivery login failure: Email ${email} not found or role mismatch.`);
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Check if user is active
  if (!user.isActive) {
    console.warn(`[Auth Audit] Delivery login failure: Account for ${email} is inactive.`);
    throw new ApiError(403, 'Your account has been deactivated.');
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    console.warn(`[Auth Audit] Delivery login failure: Invalid password for ${email}.`);
    throw new ApiError(401, 'Invalid email or password.');
  }

  console.log(`[Auth Audit] Delivery login success for email: ${email}`);

  // Generate JWT token
  const token = generateAccessToken({
    id: user._id.toString(),
    email: user.email,
    role: 'deliveryPartner',
  });

  // Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        phone: user.phone,
        vehicleType: user.vehicleType,
        vehicleNumber: user.vehicleNumber,
      },
      token,
    },
  });
});

