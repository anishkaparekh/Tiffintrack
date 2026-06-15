export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: 'Bike' | 'Scooter' | 'Bicycle' | 'Walking';
  deliveryZones: string[];
  status: 'Active' | 'Inactive';
  todayDeliveriesCount: number;
}

export interface DeliveryAssignment {
  id: string;
  customerName: string;
  customerPhone?: string;
  mealName: string;
  deliveryAddress: string;
  landmark?: string;
  deliveryInstructions?: string;
  deliveryTime: string;
  status: 'Pending Assignment' | 'Assigned' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Failed';
  assignedPartnerId: string | null;
  assignedPartnerName: string | null;
}

export const RAJKOT_ZONES = [
  "Kalawad Road, Rajkot",
  "Yagnik Road, Rajkot",
  "Amin Marg, Rajkot",
  "Moti Tanki Chowk, Rajkot",
  "University Road, Rajkot",
  "150 Feet Ring Road, Rajkot",
  "Raiya Road, Rajkot",
  "Kotecha Chowk, Rajkot"
];

const defaultPartners: DeliveryPartner[] = [
  {
    id: "DP-001",
    name: "Rahul Patel",
    phone: "+91 98250 12345",
    email: "rahul.patel@tiffintrack.com",
    vehicleType: "Bike",
    deliveryZones: ["Kalawad Road, Rajkot", "Amin Marg, Rajkot"],
    status: "Active",
    todayDeliveriesCount: 3
  },
  {
    id: "DP-002",
    name: "Amit Shah",
    phone: "+91 98980 67890",
    email: "amit.shah@tiffintrack.com",
    vehicleType: "Scooter",
    deliveryZones: ["Yagnik Road, Rajkot", "Moti Tanki Chowk, Rajkot"],
    status: "Active",
    todayDeliveriesCount: 2
  },
  {
    id: "DP-003",
    name: "Karan Mehta",
    phone: "+91 97240 54321",
    email: "karan.mehta@tiffintrack.com",
    vehicleType: "Bicycle",
    deliveryZones: ["Raiya Road, Rajkot", "Kotecha Chowk, Rajkot"],
    status: "Active",
    todayDeliveriesCount: 2
  },
  {
    id: "DP-004",
    name: "Rakesh Joshi",
    phone: "+91 99090 98765",
    email: "rakesh.joshi@tiffintrack.com",
    vehicleType: "Bike",
    deliveryZones: ["University Road, Rajkot", "150 Feet Ring Road, Rajkot"],
    status: "Active",
    todayDeliveriesCount: 1
  },
  {
    id: "DP-005",
    name: "Sanjay Dave",
    phone: "+91 98790 11223",
    email: "sanjay.dave@tiffintrack.com",
    vehicleType: "Walking",
    deliveryZones: ["Moti Tanki Chowk, Rajkot", "Kotecha Chowk, Rajkot"],
    status: "Active",
    todayDeliveriesCount: 0
  },
  {
    id: "DP-006",
    name: "Vijay Parmar",
    phone: "+91 94260 44556",
    email: "vijay.parmar@tiffintrack.com",
    vehicleType: "Scooter",
    deliveryZones: ["University Road, Rajkot"],
    status: "Inactive",
    todayDeliveriesCount: 0
  }
];

const defaultDeliveries: DeliveryAssignment[] = [
  {
    id: "OD-5011",
    customerName: "Hardik Pandya",
    customerPhone: "+91 98765 00111",
    mealName: "Kathiyawadi Premium Lunch Thali",
    deliveryAddress: "A-102, Shivalik Hills, Kalawad Road, Rajkot",
    landmark: "Near Kotecha Circle",
    deliveryInstructions: "Leave the bag at the doorstep and ring the bell once.",
    deliveryTime: "12:30 PM - 1:00 PM",
    status: "Assigned",
    assignedPartnerId: "DP-001",
    assignedPartnerName: "Rahul Patel"
  },
  {
    id: "OD-5012",
    customerName: "Pooja Jadeja",
    customerPhone: "+91 99988 77665",
    mealName: "Gujarati Regular Lunch Thali",
    deliveryAddress: "12, Gokul Row House, Amin Marg, Rajkot",
    landmark: "Near Gokul Temple",
    deliveryInstructions: "Ring bell twice. If unavailable, handover to neighbor at flat 14.",
    deliveryTime: "12:30 PM - 1:00 PM",
    status: "Assigned",
    assignedPartnerId: "DP-001",
    assignedPartnerName: "Rahul Patel"
  },
  {
    id: "OD-5013",
    customerName: "Nilesh Vyas",
    customerPhone: "+91 98250 88776",
    mealName: "Kathiyawadi Premium Lunch Thali",
    deliveryAddress: "45, Royal Residency, Raiya Road, Rajkot",
    landmark: "Opposite Raiya Telephone Exchange",
    deliveryInstructions: "Handover directly to client. Do not leave unattended.",
    deliveryTime: "1:00 PM - 1:30 PM",
    status: "Assigned",
    assignedPartnerId: "DP-003",
    assignedPartnerName: "Karan Mehta"
  },
  {
    id: "OD-5014",
    customerName: "Kiran Trivedi",
    customerPhone: "+91 94260 11223",
    mealName: "Jain Special Thali",
    deliveryAddress: "Flat 402, Shivam Appts, Yagnik Road, Rajkot",
    landmark: "Behind Big Bazaar",
    deliveryInstructions: "Enter from block B gate. Lift is working.",
    deliveryTime: "1:00 PM - 1:30 PM",
    status: "Assigned",
    assignedPartnerId: "DP-002",
    assignedPartnerName: "Amit Shah"
  },
  {
    id: "OD-5015",
    customerName: "Dhara Sheth",
    customerPhone: "+91 90990 44556",
    mealName: "Gujarati Regular Lunch Thali",
    deliveryAddress: "B-4, Mangal Deep Society, University Road, Rajkot",
    landmark: "Near Saurashtra University Gate",
    deliveryInstructions: "Call when you reach the society main entrance.",
    deliveryTime: "1:30 PM - 2:00 PM",
    status: "Assigned",
    assignedPartnerId: "DP-004",
    assignedPartnerName: "Rakesh Joshi"
  },
  {
    id: "OD-5016",
    customerName: "Manish Vaghela",
    customerPhone: "+91 97240 99887",
    mealName: "Kathiyawadi Premium Lunch Thali",
    deliveryAddress: "Flat 101, Nilkanth Flats, Moti Tanki Chowk, Rajkot",
    landmark: "Near Moti Tanki Chowk Petrol Pump",
    deliveryInstructions: "Deliver to 1st floor. Ring bell twice.",
    deliveryTime: "12:30 PM - 1:00 PM",
    status: "Assigned",
    assignedPartnerId: "DP-002",
    assignedPartnerName: "Amit Shah"
  },
  {
    id: "OD-5017",
    customerName: "Jignesh Shah",
    customerPhone: "+91 98240 66778",
    mealName: "Jain Special Thali",
    deliveryAddress: "22, Shrinathji Society, Raiya Road, Rajkot",
    landmark: "Opposite Raiya Lake",
    deliveryInstructions: "Leave with society watchman if flat is locked.",
    deliveryTime: "12:30 PM - 1:00 PM",
    status: "Assigned",
    assignedPartnerId: "DP-003",
    assignedPartnerName: "Karan Mehta"
  },
  {
    id: "OD-5018",
    customerName: "Trupti Rathod",
    customerPhone: "+91 91060 55443",
    mealName: "Kathiyawadi Premium Lunch Thali",
    deliveryAddress: "Flat 303, Harmony Heights, Kalawad Road, Rajkot",
    landmark: "Opposite Crystal Mall",
    deliveryInstructions: "Check for security clearance at the main gate.",
    deliveryTime: "1:00 PM - 1:30 PM",
    status: "Assigned",
    assignedPartnerId: "DP-001",
    assignedPartnerName: "Rahul Patel"
  },
  {
    id: "OD-5019",
    customerName: "Bhavin Joshi",
    customerPhone: "+91 98981 22334",
    mealName: "Gujarati Regular Lunch Thali",
    deliveryAddress: "8, Krishna Bungalows, Amin Marg, Rajkot",
    landmark: "Near Amin Marg Circle",
    deliveryInstructions: "Keep tiffin in the designated delivery box near gate.",
    deliveryTime: "1:00 PM - 1:30 PM",
    status: "Pending Assignment",
    assignedPartnerId: null,
    assignedPartnerName: null
  },
  {
    id: "OD-5020",
    customerName: "Sheetal Merchant",
    customerPhone: "+91 94080 33445",
    mealName: "Kathiyawadi Premium Lunch Thali",
    deliveryAddress: "19, Green Park Residency, 150 Feet Ring Road, Rajkot",
    landmark: "Near Madhapar Chowkdi",
    deliveryInstructions: "Call client directly upon arrival.",
    deliveryTime: "1:30 PM - 2:00 PM",
    status: "Pending Assignment",
    assignedPartnerId: null,
    assignedPartnerName: null
  },
  {
    id: "OD-5021",
    customerName: "Ramesh Patel",
    customerPhone: "+91 95580 44552",
    mealName: "Jain Special Thali",
    deliveryAddress: "Flat 202, Nilkanth Flats, Kotecha Chowk, Rajkot",
    landmark: "Near Kotecha Chowk",
    deliveryInstructions: "Deliver directly to flat 202, lift is on the left.",
    deliveryTime: "12:30 PM - 1:00 PM",
    status: "Pending Assignment",
    assignedPartnerId: null,
    assignedPartnerName: null
  },
  {
    id: "OD-5022",
    customerName: "Meera Solanki",
    customerPhone: "+91 98795 66778",
    mealName: "Gujarati Regular Lunch Thali",
    deliveryAddress: "B-12, Gokul Row House, University Road, Rajkot",
    landmark: "Behind Saurashtra University",
    deliveryInstructions: "Call on phone first. Ring bell only if phone is unreachable.",
    deliveryTime: "1:30 PM - 2:00 PM",
    status: "Pending Assignment",
    assignedPartnerId: null,
    assignedPartnerName: null
  }
];

export function getStoredPartners(): DeliveryPartner[] {
  const data = localStorage.getItem('vendor_delivery_partners');
  if (!data) {
    localStorage.setItem('vendor_delivery_partners', JSON.stringify(defaultPartners));
    return defaultPartners;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultPartners;
  }
}

export function savePartners(partners: DeliveryPartner[]): void {
  localStorage.setItem('vendor_delivery_partners', JSON.stringify(partners));
}

export function getStoredDeliveries(): DeliveryAssignment[] {
  const data = localStorage.getItem('vendor_deliveries');
  if (!data) {
    localStorage.setItem('vendor_deliveries', JSON.stringify(defaultDeliveries));
    return defaultDeliveries;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultDeliveries;
  }
}

export function saveDeliveries(deliveries: DeliveryAssignment[]): void {
  localStorage.setItem('vendor_deliveries', JSON.stringify(deliveries));
}
