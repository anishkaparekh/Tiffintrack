const defaultDeliveries = [
  {
    id: "OD-4821",
    customerName: "Ananya Rao",
    customerPhone: "+91 98765 43210",
    mealType: "Gujarati Lunch Thali",
    address: "Flat 402, Shivam Heights, Anand",
    landmark: "Near Town Hall",
    deliveryInstructions: "Please call on arrival, lift is working.",
    timeSlot: "12:30 PM - 1:00 PM",
    status: "Pending",
    notes: "Please call on arrival, lift is working."
  },
  {
    id: "OD-4822",
    customerName: "Aditya Singh",
    customerPhone: "+91 99988 77665",
    mealType: "Punjabi Veg Deluxe",
    address: "12, Gokul Society, Near Amul Dairy, Anand",
    landmark: "Near Amul Dairy Gate",
    deliveryInstructions: "Leave at security gate if unavailable.",
    timeSlot: "12:30 PM - 1:00 PM",
    status: "Picked Up",
    notes: "Leave at security gate if unavailable."
  },
  {
    id: "OD-4823",
    customerName: "Sneha Reddy",
    customerPhone: "+91 98250 88776",
    mealType: "Satvik Regular Plan",
    address: "A-5, Green Park Residency, Vallabh Vidyanagar",
    landmark: "Opposite Green Park Complex",
    deliveryInstructions: "Ring bell twice, deliver to first floor.",
    timeSlot: "1:00 PM - 1:30 PM",
    status: "Pending",
    notes: "Ring bell twice, deliver to first floor."
  },
  {
    id: "OD-4824",
    customerName: "Amit Patel",
    customerPhone: "+91 94260 11223",
    mealType: "Gujarati Lunch Thali",
    address: "Flat 101, Nilkanth Flats, Anand",
    landmark: "Near Nilkanth Temple",
    deliveryInstructions: "Handover directly to client.",
    timeSlot: "1:00 PM - 1:30 PM",
    status: "Picked Up",
    notes: "Handover directly to client."
  },
  {
    id: "OD-4825",
    customerName: "Priya Sharma",
    customerPhone: "+91 90990 44556",
    mealType: "Punjabi Veg Deluxe",
    address: "25, Vaikunth Bungalows, Karamsad Road",
    landmark: "Near Vaikunth Gate",
    deliveryInstructions: "Contact chef Priya if address not found.",
    timeSlot: "1:30 PM - 2:00 PM",
    status: "Pending",
    notes: "Contact chef Priya if address not found."
  },
  {
    id: "OD-4820",
    customerName: "Rohan Gupta",
    customerPhone: "+91 97240 99887",
    mealType: "Satvik Regular Plan",
    address: "B-12, Shrinathji Society, Anand",
    landmark: "Opposite Shrinathji Temple",
    deliveryInstructions: "Phone switched off, house locked.",
    timeSlot: "12:00 PM - 12:30 PM",
    status: "Failed",
    failReason: "Customer Unavailable",
    notes: "Phone switched off, house locked."
  }
];

export const initialDeliveries = (() => {
  const data = localStorage.getItem('vendor_deliveries');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      const partnerDeliveries = parsed.filter(d => d.assignedPartnerId === 'DP-001');
      if (partnerDeliveries.length > 0) {
        return partnerDeliveries.map(d => {
          let mappedStatus = 'Pending';
          if (d.status === 'Preparing' || d.status === 'Assigned') mappedStatus = 'Pending';
          else if (d.status === 'Out for Delivery') mappedStatus = 'Picked Up';
          else if (d.status === 'Delivered') mappedStatus = 'Delivered';
          else if (d.status === 'Failed') mappedStatus = 'Failed';
          
          return {
            id: d.id,
            customerName: d.customerName,
            customerPhone: d.customerPhone || "+91 98765 00111",
            mealType: d.mealName,
            address: d.deliveryAddress,
            landmark: d.landmark || "Near Center",
            deliveryInstructions: d.deliveryInstructions || "Leave at door.",
            timeSlot: d.deliveryTime,
            status: mappedStatus,
            notes: d.deliveryInstructions || "Deliver from Rajkot Central Kitchen."
          };
        });
      }
    } catch(e) {}
  }
  return defaultDeliveries;
})();

export const completedDeliveries = [
  {
    id: "OD-4819",
    customerName: "Rajesh Joshi",
    date: "14 June 2026",
    meal: "Gujarati Lunch Thali",
    status: "Delivered",
    address: "Anand Town Hall area"
  },
  {
    id: "OD-4818",
    customerName: "Divya Nair",
    date: "14 June 2026",
    meal: "Punjabi Veg Deluxe",
    status: "Delivered",
    address: "Shastri Marg, Vidyanagar"
  },
  {
    id: "OD-4817",
    customerName: "Vikram Rathod",
    date: "14 June 2026",
    meal: "Satvik Regular Plan",
    status: "Delivered",
    address: "Bhaikaka Marg, Anand"
  },
  {
    id: "OD-4816",
    customerName: "Sanjana Roy",
    date: "13 June 2026",
    meal: "Gujarati Lunch Thali",
    status: "Delivered",
    address: "Vallabh Vidyanagar"
  },
  {
    id: "OD-4815",
    customerName: "Karan Sharma",
    date: "13 June 2026",
    meal: "Punjabi Veg Deluxe",
    status: "Delivered",
    address: "Lambhvel Road, Anand"
  },
  {
    id: "OD-4814",
    customerName: "Hiten Dave",
    date: "13 June 2026",
    meal: "Satvik Regular Plan",
    status: "Delivered",
    address: "Ganesh Colony, Anand"
  },
  {
    id: "OD-4813",
    customerName: "Nikhil Mehta",
    date: "12 June 2026",
    meal: "Gujarati Lunch Thali",
    status: "Delivered",
    address: "Amul Dairy Road"
  },
  {
    id: "OD-4812",
    customerName: "Pooja Patel",
    date: "12 June 2026",
    meal: "Punjabi Veg Deluxe",
    status: "Delivered",
    address: "Vallabh Vidyanagar"
  },
  {
    id: "OD-4811",
    customerName: "Deepak Verma",
    date: "12 June 2026",
    meal: "Satvik Regular Plan",
    status: "Delivered",
    address: "Janta Chowkdi, Anand"
  },
  {
    id: "OD-4810",
    customerName: "Neha Shah",
    date: "11 June 2026",
    meal: "Gujarati Lunch Thali",
    status: "Delivered",
    address: "Chimanbhai Patel Road"
  },
  {
    id: "OD-4809",
    customerName: "Manish Kumar",
    date: "11 June 2026",
    meal: "Punjabi Veg Deluxe",
    status: "Delivered",
    address: "Station Road, Anand"
  },
  {
    id: "OD-4808",
    customerName: "Kiran Rao",
    date: "11 June 2026",
    meal: "Satvik Regular Plan",
    status: "Delivered",
    address: "Vidyanagar Road"
  }
];

export const deliveryNotifications = [
  {
    id: "nt-del-1",
    category: "assignment",
    message: "New delivery assigned: OD-4825 for Priya Sharma.",
    timestamp: "10 mins ago",
    isRead: false
  },
  {
    id: "nt-del-2",
    category: "unavailable",
    message: "Customer unavailable at Shrinathji Society (Rohan Gupta). Delivery marked failed.",
    timestamp: "1 hour ago",
    isRead: false
  },
  {
    id: "nt-del-3",
    category: "success",
    message: "Delivery completed successfully: OD-4819 for Rajesh Joshi.",
    timestamp: "2 hours ago",
    isRead: true
  },
  {
    id: "nt-del-4",
    category: "update",
    message: "Vendor 'Priya's Home Kitchen' updated instructions for Sneha Reddy: Ring bell twice.",
    timestamp: "4 hours ago",
    isRead: true
  }
];

export const deliveryProfile = {
  name: "Rahul Kumar",
  role: "Delivery Partner",
  phone: "+91 98765 43210",
  email: "rahul.delivery@tiffintrack.com",
  vehicleNumber: "GJ-23-AB-1234",
  vehicleType: "Two Wheeler (Bike)",
  assignedVendor: "Priya's Home Kitchen",
  joinedDate: "15 April 2026"
};
