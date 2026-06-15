import { Request, Response } from 'express';
import { Address } from '../models/Address';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Create a new Customer Address.
 * POST /api/v1/addresses
 */
export const createAddress = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const customerId = req.user.id;
  const {
    fullName,
    phoneNumber,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    pincode,
    latitude,
    longitude,
    isDefault,
  } = req.body;

  // Check if it is the customer's first address
  const count = await Address.countDocuments({ customerId });
  const shouldBeDefault = count === 0 ? true : !!isDefault;

  // If this address should be default, reset any other defaults first
  if (shouldBeDefault) {
    await Address.updateMany({ customerId }, { isDefault: false });
  }

  const address = await Address.create({
    customerId,
    fullName,
    phoneNumber,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    pincode,
    latitude,
    longitude,
    isDefault: shouldBeDefault,
  });

  res.status(201).json({
    success: true,
    message: 'Address created successfully',
    data: address,
  });
});

/**
 * Get all addresses for a customer.
 * GET /api/v1/addresses/customer/:customerId
 */
export const getCustomerAddresses = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  // Authorize owner or admin
  if (req.user.id !== customerId && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. You cannot view other customers\' addresses.');
  }

  const addresses = await Address.find({ customerId })
    .sort({ isDefault: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: addresses.length,
    data: addresses,
  });
});

/**
 * Update an existing Address.
 * PUT /api/v1/addresses/:id
 */
export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const address = await Address.findById(id);
  if (!address) {
    throw new ApiError(404, 'Address not found.');
  }

  // Ownership verification
  if (address.customerId.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied. You cannot modify other customers\' addresses.');
  }

  const {
    fullName,
    phoneNumber,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    pincode,
    latitude,
    longitude,
    isDefault,
  } = req.body;

  let shouldBeDefault = address.isDefault;
  if (isDefault !== undefined) {
    shouldBeDefault = isDefault;
  }

  // If updating to be default, reset other default addresses
  if (shouldBeDefault && !address.isDefault) {
    await Address.updateMany({ customerId: req.user.id }, { isDefault: false });
  }

  const updatedAddress = await Address.findByIdAndUpdate(
    id,
    {
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isDefault: shouldBeDefault,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: updatedAddress,
  });
});

/**
 * Delete an Address.
 * DELETE /api/v1/addresses/:id
 */
export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const address = await Address.findById(id);
  if (!address) {
    throw new ApiError(404, 'Address not found.');
  }

  // Ownership verification or admin
  if (address.customerId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. You are not authorized to delete this address.');
  }

  const wasDefault = address.isDefault;
  const customerId = address.customerId;

  await Address.findByIdAndDelete(id);

  // If deleted address was default, promote another remaining address to default
  if (wasDefault) {
    const nextAddress = await Address.findOne({ customerId });
    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
  });
});

/**
 * Set a specific Address as default.
 * PATCH /api/v1/addresses/:id/default
 */
export const setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'User not authenticated.');
  }

  const address = await Address.findById(id);
  if (!address) {
    throw new ApiError(404, 'Address not found.');
  }

  // Ownership verification
  if (address.customerId.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied. You cannot modify other customers\' addresses.');
  }

  // Reset other default addresses
  await Address.updateMany({ customerId: req.user.id }, { isDefault: false });

  address.isDefault = true;
  await address.save();

  res.status(200).json({
    success: true,
    message: 'Address set as default successfully',
    data: address,
  });
});
