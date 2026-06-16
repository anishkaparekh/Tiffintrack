export const ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin',
  DELIVERY_PARTNER: 'deliveryPartner',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];
