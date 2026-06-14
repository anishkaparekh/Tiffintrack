import { Request, Response } from 'express';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { NotificationService } from '../services/notification.service';

/**
 * Get all approved vendors.
 * Accessible to public / customers.
 * GET /api/v1/vendors
 */
export const getApprovedVendors = asyncHandler(async (_req: Request, res: Response) => {
  const vendors = await User.find({
    role: 'vendor',
    verificationStatus: 'approved'
  }).select('-password');

  res.status(200).json({
    success: true,
    count: vendors.length,
    data: vendors
  });
});

/**
 * Get all vendors (including pending/rejected/under_review).
 * Restricted to admins.
 * GET /api/v1/vendors/all
 */
export const getAllVendors = asyncHandler(async (_req: Request, res: Response) => {
  const vendors = await User.find({
    role: 'vendor'
  }).select('-password');

  res.status(200).json({
    success: true,
    count: vendors.length,
    data: vendors
  });
});

/**
 * Update vendor verification status.
 * Restricted to admins.
 * PATCH /api/v1/vendors/:id/verify
 */
export const verifyVendor = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' | 'rejected' | 'under_review' | 'pending'

  if (!status) {
     throw new ApiError(400, 'Verification status is required.');
  }

  const validStatuses = ['pending', 'under_review', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid verification status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const vendor = await User.findOneAndUpdate(
    { _id: id, role: 'vendor' },
    { verificationStatus: status },
    { new: true, runValidators: true }
  ).select('-password');

  if (!vendor) {
    throw new ApiError(404, 'Vendor not found or user is not a vendor.');
  }

  // Trigger Notification to Vendor
  let title = '';
  let message = '';
  let type: 'success' | 'warning' | 'info' = 'info';

  if (status === 'approved') {
    title = '🌟 Kitchen Registration Approved!';
    message = `Congratulations! Your kitchen "${vendor.businessName || vendor.name}" has been approved. You can now list plans and accept orders!`;
    type = 'success';
  } else if (status === 'rejected') {
    title = '⚠️ Kitchen Verification Rejected';
    message = `Your kitchen verification request was rejected. Please review your details or contact support.`;
    type = 'warning';
  } else if (status === 'under_review') {
    title = 'ℹ️ Kitchen Under Review';
    message = `Your kitchen registration is currently under review by our administration team.`;
    type = 'info';
  }

  if (title) {
    await NotificationService.createNotification({
      userId: vendor._id.toString(),
      userRole: 'vendor',
      title,
      message,
      category: 'VENDOR',
      type,
    });
  }

  // Trigger Notification to Admins
  await NotificationService.createSystemNotificationForAdmins(
    '🛡️ Vendor Verification Updated',
    `Vendor "${vendor.name}" (${vendor.businessName || 'No business name'}) verification status updated to '${status}'.`,
    { vendorId: vendor._id, status }
  );

  res.status(200).json({
    success: true,
    message: `Vendor verification status updated to '${status}' successfully.`,
    data: vendor
  });
});

/**
 * Get vendor by ID.
 * GET /api/v1/vendors/:id
 */
export const getVendorById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const vendor = await User.findOne({
    _id: id,
    role: 'vendor'
  }).select('-password');

  if (!vendor) {
    throw new ApiError(404, 'Vendor not found.');
  }

  res.status(200).json({
    success: true,
    data: vendor
  });
});
