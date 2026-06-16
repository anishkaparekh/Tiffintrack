import { Router } from 'express';
import {
  getVendorTodayDeliveries,
  getVendorUnassignedDeliveries,
  getVendorAssignedDeliveries,
  getVendorDeliveredDeliveries,
  getVendorFailedDeliveries,
  getVendorDeliveriesByStatus,
  getVendorDeliveryPartners,
  assignDeliveryPartner,
  assignDeliveryPartnerBulk,
  getVendorAnalytics,
  getDeliveryPartnerToday,
  getDeliveryPartnerHistory,
  updateDeliveryStatus,
  getCustomerUpcoming,
  getCustomerHistory
} from '../controllers/delivery.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// ==========================================
// VENDOR ROUTINGS
// ==========================================
router.get('/vendor/today', authenticate, authorize('vendor'), getVendorTodayDeliveries);
router.get('/vendor/unassigned', authenticate, authorize('vendor'), getVendorUnassignedDeliveries);
router.get('/vendor/assigned', authenticate, authorize('vendor'), getVendorAssignedDeliveries);
router.get('/vendor/delivered', authenticate, authorize('vendor'), getVendorDeliveredDeliveries);
router.get('/vendor/failed', authenticate, authorize('vendor'), getVendorFailedDeliveries);
router.get('/vendor/partners', authenticate, authorize('vendor'), getVendorDeliveryPartners);
router.get('/vendor/analytics', authenticate, authorize('vendor'), getVendorAnalytics);
router.get('/vendor/status/:status', authenticate, authorize('vendor'), getVendorDeliveriesByStatus);

router.patch('/:deliveryId/assign', authenticate, authorize('vendor'), assignDeliveryPartner);
router.patch('/assign-bulk', authenticate, authorize('vendor'), assignDeliveryPartnerBulk);

// ==========================================
// DELIVERY PARTNER ROUTINGS
// ==========================================
router.get('/delivery-partner/deliveries/today', authenticate, authorize('deliveryPartner'), getDeliveryPartnerToday);
router.get('/delivery-partner/deliveries/history', authenticate, authorize('deliveryPartner'), getDeliveryPartnerHistory);
router.patch('/delivery-partner/deliveries/:deliveryId/status', authenticate, authorize('deliveryPartner'), updateDeliveryStatus);

// Also support paths without "/deliveries" prefix in sub-path if mounted on /delivery-partner
router.get('/deliveries/today', authenticate, authorize('deliveryPartner'), getDeliveryPartnerToday);
router.get('/deliveries/history', authenticate, authorize('deliveryPartner'), getDeliveryPartnerHistory);
router.patch('/deliveries/:deliveryId/status', authenticate, authorize('deliveryPartner'), updateDeliveryStatus);

// ==========================================
// CUSTOMER ROUTINGS
// ==========================================
router.get('/customer/upcoming-deliveries', authenticate, authorize('customer'), getCustomerUpcoming);
router.get('/customer/delivery-history', authenticate, authorize('customer'), getCustomerHistory);

// Also support paths without "/deliveries" prefix in sub-path if mounted on /customer
router.get('/upcoming-deliveries', authenticate, authorize('customer'), getCustomerUpcoming);
router.get('/delivery-history', authenticate, authorize('customer'), getCustomerHistory);

// Compatibility
router.get('/customer/upcoming', authenticate, authorize('customer'), getCustomerUpcoming);
router.get('/customer/history', authenticate, authorize('customer'), getCustomerHistory);

export default router;
