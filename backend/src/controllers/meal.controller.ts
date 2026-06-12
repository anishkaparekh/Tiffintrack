import { Request, Response } from 'express';
import { Meal } from '../models/Meal';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Create a new Meal (Vendor only).
 * POST /api/v1/meals
 */
export const createMeal = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  // Set vendorId from authenticated token
  const vendorId = req.user.role === 'admin' ? (req.body.vendorId || req.user.id) : req.user.id;

  const { mealName, description, price, mealType, availability, imageUrl } = req.body;

  const meal = await Meal.create({
    vendorId,
    mealName,
    description,
    price,
    mealType,
    availability,
    imageUrl,
  });

  res.status(201).json({
    success: true,
    message: 'Meal created successfully',
    data: meal,
  });
});

/**
 * Get all meals for a specific vendor (Public).
 * GET /api/v1/meals/vendor/:vendorId
 */
export const getVendorMeals = asyncHandler(async (req: Request, res: Response) => {
  const { vendorId } = req.params;

  const meals = await Meal.find({ vendorId });

  res.status(200).json({
    success: true,
    count: meals.length,
    data: meals,
  });
});

/**
 * Get a specific meal by ID (Public).
 * GET /api/v1/meals/:id
 */
export const getMealById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const meal = await Meal.findById(id);

  if (!meal) {
    throw new ApiError(404, 'Meal not found');
  }

  res.status(200).json({
    success: true,
    data: meal,
  });
});

/**
 * Update a meal (Vendor / Admin only).
 * PUT /api/v1/meals/:id
 */
export const updateMeal = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const meal = await Meal.findById(id);

  if (!meal) {
    throw new ApiError(404, 'Meal not found');
  }

  // Check ownership: Vendor can only update their own meals
  if (req.user.role === 'vendor' && meal.vendorId.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied. You do not own this meal.');
  }

  const { mealName, description, price, mealType, availability, imageUrl } = req.body;

  const updatedMeal = await Meal.findByIdAndUpdate(
    id,
    { mealName, description, price, mealType, availability, imageUrl },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Meal updated successfully',
    data: updatedMeal,
  });
});

/**
 * Delete a meal (Vendor / Admin only).
 * DELETE /api/v1/meals/:id
 */
export const deleteMeal = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const meal = await Meal.findById(id);

  if (!meal) {
    throw new ApiError(404, 'Meal not found');
  }

  // Check ownership: Vendor can only delete their own meals
  if (req.user.role === 'vendor' && meal.vendorId.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied. You do not own this meal.');
  }

  await Meal.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Meal deleted successfully',
  });
});
