export interface VendorUser {
  name: string;
  email: string;
  role: string;
  isAuthenticated: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: {
    name: string;
    email: string;
    role: string;
  };
  error?: string;
}

export const MOCK_VENDOR = {
  email: 'vendor@tiffintrack.com',
  password: 'Vendor@123',
  name: 'Priya Shah',
  role: 'vendor'
};

/**
 * Validates credentials against mock database, logging detailed debug data,
 * and returning a structured AuthResult response.
 */
export const signInVendor = (email: string, password: string): AuthResult => {
  const cleanEmail = (email || '').trim();
  const cleanPassword = (password || '').trim();
  
  // Temporary debugging logs (Requirement 5)
  console.log(`[mockAuth] Submitted email: "${cleanEmail}"`);
  console.log(`[mockAuth] Submitted password length: ${cleanPassword.length} characters (Actual password hidden)`);
  console.log(`[mockAuth] Expected email: "${MOCK_VENDOR.email}"`);

  // Case-insensitive email check, case-sensitive password check
  const emailMatch = cleanEmail.toLowerCase() === MOCK_VENDOR.email.toLowerCase();
  const passwordMatch = cleanPassword === MOCK_VENDOR.password;

  if (emailMatch && passwordMatch) {
    const userStorageObj = {
      name: MOCK_VENDOR.name,
      email: MOCK_VENDOR.email,
      role: MOCK_VENDOR.role,
      isAuthenticated: true
    };
    
    let localStorageStatus = 'FAILED';
    try {
      localStorage.setItem('tiffintrack_vendor_user', JSON.stringify(userStorageObj));
      localStorageStatus = 'SUCCESS';
    } catch (e) {
      console.error('[mockAuth] Failed writing to localStorage:', e);
    }
    
    console.log(`[mockAuth] localStorage update status: ${localStorageStatus}`);
    
    const result: AuthResult = {
      success: true,
      user: {
        name: MOCK_VENDOR.name,
        email: MOCK_VENDOR.email,
        role: MOCK_VENDOR.role
      }
    };
    
    console.log('[mockAuth] Authentication result:', result);
    return result;
  }

  const failedResult: AuthResult = {
    success: false,
    error: 'Invalid email or password.'
  };
  
  console.warn('[mockAuth] Authentication result: FAILED (Invalid email or password)');
  return failedResult;
};

/**
 * Removes the vendor authentication data from localStorage.
 */
export const signOutVendor = (): void => {
  console.log('[mockAuth] signOutVendor: Clearing user session from localStorage.');
  localStorage.removeItem('tiffintrack_vendor_user');
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
    console.error('[mockAuth] Failed to parse vendor user from localStorage:', error);
    return null;
  }
};

/**
 * Returns whether a valid vendor session exists.
 */
export const isVendorAuthenticated = (): boolean => {
  const user = getCurrentUser();
  const authenticated = !!(user && user.isAuthenticated && user.role === 'vendor');
  console.log(`[mockAuth] isVendorAuthenticated checked: ${authenticated}`);
  return authenticated;
};
