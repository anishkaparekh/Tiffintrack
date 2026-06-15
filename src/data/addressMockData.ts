export interface Address {
  id: string;
  label: string; // e.g., 'Home', 'Work', 'Parents', 'Gym'
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  deliveryInstructions?: string;
  isDefault: boolean;
}

const defaultAddresses: Address[] = [
  {
    id: "ADDR-001",
    label: "Home",
    fullName: "Ananya Rao",
    phone: "+91 98765 43210",
    addressLine1: "Flat 402, Shivam Heights",
    addressLine2: "Shastri Marg",
    area: "Vidyanagar",
    city: "Anand",
    state: "Gujarat",
    pincode: "388120",
    landmark: "Near Town Hall",
    deliveryInstructions: "Leave at the doorstep, ring bell once.",
    isDefault: true
  },
  {
    id: "ADDR-002",
    label: "Work (Office)",
    fullName: "Ananya Rao",
    phone: "+91 98765 43210",
    addressLine1: "301, Tech Park",
    addressLine2: "Kalawad Road",
    area: "Kalawad Road",
    city: "Rajkot",
    state: "Gujarat",
    pincode: "360005",
    landmark: "Opposite Crystal Mall",
    deliveryInstructions: "Deliver to the reception desk on the 3rd floor.",
    isDefault: false
  },
  {
    id: "ADDR-003",
    label: "Parents' House",
    fullName: "Ananya Rao",
    phone: "+91 98765 00112",
    addressLine1: "12, Gokul Row House",
    addressLine2: "Amin Marg",
    area: "Amin Marg",
    city: "Rajkot",
    state: "Gujarat",
    pincode: "360001",
    landmark: "Near Gokul Temple",
    deliveryInstructions: "Call before arrival. Deliver only between 10 AM and 6 PM.",
    isDefault: false
  }
];

export function getStoredAddresses(): Address[] {
  const data = localStorage.getItem('tiffintrack_customer_addresses');
  if (!data) {
    localStorage.setItem('tiffintrack_customer_addresses', JSON.stringify(defaultAddresses));
    return defaultAddresses;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultAddresses;
  }
}

export function saveAddresses(addresses: Address[]): void {
  localStorage.setItem('tiffintrack_customer_addresses', JSON.stringify(addresses));
}

export function addAddress(address: Omit<Address, 'id'>): Address {
  const addresses = getStoredAddresses();
  const newAddress: Address = {
    ...address,
    id: `ADDR-${Date.now()}`
  };

  if (newAddress.isDefault) {
    // Unset other defaults
    addresses.forEach(a => a.isDefault = false);
  } else if (addresses.length === 0) {
    newAddress.isDefault = true;
  }

  addresses.push(newAddress);
  saveAddresses(addresses);
  return newAddress;
}

export function updateAddress(updatedAddress: Address): void {
  const addresses = getStoredAddresses();
  const index = addresses.findIndex(a => a.id === updatedAddress.id);
  if (index !== -1) {
    if (updatedAddress.isDefault) {
      addresses.forEach(a => {
        if (a.id !== updatedAddress.id) {
          a.isDefault = false;
        }
      });
    }
    addresses[index] = updatedAddress;
    saveAddresses(addresses);
  }
}

export function deleteAddress(id: string): void {
  let addresses = getStoredAddresses();
  const toDelete = addresses.find(a => a.id === id);
  addresses = addresses.filter(a => a.id !== id);

  if (toDelete && toDelete.isDefault && addresses.length > 0) {
    // Set first remaining address as default
    addresses[0].isDefault = true;
  }

  saveAddresses(addresses);
}

export function setDefaultAddress(id: string): void {
  const addresses = getStoredAddresses();
  addresses.forEach(a => {
    a.isDefault = a.id === id;
  });
  saveAddresses(addresses);
}
