export interface VendorUser {
  name: string;
  email: string;
  role: string;
  isAuthenticated: boolean;
}

/**
 * Removes the vendor authentication data from localStorage.
 */
export const signOutVendor = (): void => {
  console.log('[session] signOutVendor: Clearing user session and token from localStorage.');
  localStorage.removeItem('tiffintrack_vendor_user');
  localStorage.removeItem('token');
};

/**
 * Fetches the current authenticated user session if present.
 */
export const getCurrentUser = (): VendorUser | null => {
  const data = localStorage.getItem('tiffintrack_vendor_user');
  if (!data) {
    return null;
  }
  try {
    const user = JSON.parse(data) as VendorUser;
    return user;
  } catch (error) {
    console.error('[session] Failed to parse vendor user from localStorage:', error);
    return null;
  }
};

/**
 * Returns whether a valid vendor session exists.
 */
export const isVendorAuthenticated = (): boolean => {
  const user = getCurrentUser();
  const token = localStorage.getItem('token');
  const authenticated = !!(user && user.isAuthenticated && user.role === 'vendor' && token);
  console.log(`[session] isVendorAuthenticated checked: ${authenticated}`);
  return authenticated;
};
