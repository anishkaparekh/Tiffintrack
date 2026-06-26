import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Star, 
  Flame, 
  Utensils, 
  X, 
  Inbox,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react';

// Verification status mapping (Only Approved vendors are customer-visible)
const VENDOR_STATUSES = {
  1: "Approved",
  2: "Approved",
  3: "Approved",
  4: "Approved",
  5: "Approved",
  6: "Approved",
  7: "Pending Review",
  8: "Suspended"
};


// Comprehensive mock database of meals for the 7 kitchens matching CustomerDashboard
const vendorsDb = {
  1: {
    name: "Priya's Home Kitchen",
    tagline: "Fresh homemade Gujarati meals prepared daily with love.",
    rating: 4.8,
    reviewsCount: 245,
    area: "Anand",
    locality: "Mota Bazar",
    meals: [
      // Breakfast
      {
        id: "m1_1",
        name: "Poha + Hot Tea",
        description: "Light and fluffy flattened rice steam-cooked with turmeric, mustard seeds, curry leaves, green chillies, and topped with crunchy peanuts and fresh lemon juice. Served with standard hot masala tea.",
        price: 60,
        mealType: "Breakfast",
        preference: "Veg",
        cuisine: "Gujarati",
        calories: 280,
        tags: ["Veg", "Jain Option", "Low Oil", "Popular"],
        ingredients: ["Flattened rice (Poha)", "Ginger", "Green chillies", "Mustard seeds", "Peanuts", "Lemon juice", "Curry leaves", "Tea leaves", "Milk", "Spices"],
        nutrition: { calories: 280, protein: "6g", carbs: "42g", fat: "9g" }
      },
      {
        id: "m1_2",
        name: "Suji Vegetable Upma",
        description: "Wholesome roasted semolina cooked with seasoned green peas, fresh carrots, curry leaves, and mustard seeds. Mildly spiced, soft, and satisfying.",
        price: 70,
        mealType: "Breakfast",
        preference: "Veg",
        cuisine: "South Indian",
        calories: 310,
        tags: ["Veg", "Jain Option", "Low Oil"],
        ingredients: ["Semolina (Suji)", "Carrots", "Green peas", "Mustard seeds", "Ginger", "Curry leaves", "Refined sunflower oil"],
        nutrition: { calories: 310, protein: "7g", carbs: "48g", fat: "8g" }
      },
      {
        id: "m1_3",
        name: "Methi Thepla Combo",
        description: "Three soft, paper-thin flatbreads kneaded with fresh fenugreek leaves (methi), yoghurt, and spices. Griddled with minimal oil and served with sweet mango pickle and fresh yoghurt.",
        price: 80,
        mealType: "Breakfast",
        preference: "Veg",
        cuisine: "Gujarati",
        calories: 340,
        tags: ["Veg", "Popular"],
        ingredients: ["Whole wheat flour", "Fresh fenugreek leaves (Methi)", "Yoghurt", "Turmeric powder", "Chilli powder", "Sesame seeds", "Oil"],
        nutrition: { calories: 340, protein: "9g", carbs: "52g", fat: "11g" }
      },
      // Lunch
      {
        id: "m1_4",
        name: "Traditional Gujarati Thali",
        description: "A complete, authentic Gujarati lunch box. Includes 4 soft Phulka Rotlis smeared with light ghee, 2 seasonal dry subjis (e.g., Lasaniya Bateta and Bhindi Cabbage), sweet and sour Gujarati Tuvar Dal, Steamed Basmati Rice, papad, salad, and a glass of chilled masala chaas.",
        price: 120,
        mealType: "Lunch",
        preference: "Veg",
        cuisine: "Gujarati",
        calories: 680,
        tags: ["Veg", "Popular", "Low Oil"],
        ingredients: ["Whole wheat flour", "Tuvar dal", "Basmati rice", "Okra (Bhindi)", "Potatoes", "Ghee", "Buttermilk", "Spices"],
        nutrition: { calories: 680, protein: "20g", carbs: "98g", fat: "16g" }
      },
      {
        id: "m1_5",
        name: "Jain Satvik Lunch Box",
        description: "Strictly prepared without onion, garlic, potatoes, or root vegetables. Contains 3 ghee-free rotis, a mild zucchini tomato curry, yellow moong dal tadka, steamed basmati rice, salad, and roasted papad.",
        price: 130,
        mealType: "Lunch",
        preference: "Jain",
        cuisine: "Gujarati",
        calories: 620,
        tags: ["Veg", "Jain", "Low Oil"],
        ingredients: ["Whole wheat flour", "Moong dal", "Basmati rice", "Zucchini", "Tomatoes", "Coriander", "Cumin", "Turmeric"],
        nutrition: { calories: 620, protein: "18g", carbs: "92g", fat: "10g" }
      },
      {
        id: "m1_6",
        name: "Homestyle Punjabi Lunch",
        description: "A hearty combination of rich Paneer Butter Masala cooked with minimal oil, served with 3 soft whole-wheat chapatis, jeera rice, and a cucumber onion salad.",
        price: 150,
        mealType: "Lunch",
        preference: "Veg",
        cuisine: "Punjabi",
        calories: 750,
        tags: ["Veg", "High Protein"],
        ingredients: ["Wheat flour", "Cottage cheese (Paneer)", "Tomatoes", "Cashew paste", "Basmati rice", "Cumin seeds", "Cream (low-fat)", "Spices"],
        nutrition: { calories: 750, protein: "24g", carbs: "85g", fat: "22g" }
      },
      // Dinner
      {
        id: "m1_7",
        name: "Yellow Dal Rice Combo",
        description: "Simple, comfort dinner. Yellow split lentils (Moong-Masoor Dal) cooked with tomatoes, ginger, and tempered with cumin and garlic. Served with piping hot steamed rice and roasted papad.",
        price: 110,
        mealType: "Dinner",
        preference: "Veg",
        cuisine: "North Indian",
        calories: 480,
        tags: ["Veg", "Low Oil", "Popular"],
        ingredients: ["Moong dal", "Masoor dal", "Basmati rice", "Tomatoes", "Ginger", "Garlic", "Cumin seeds", "Ghee (tempering)"],
        nutrition: { calories: 480, protein: "16g", carbs: "78g", fat: "8g" }
      },
      {
        id: "m1_8",
        name: "Paneer & Roti Dinner Box",
        description: "Freshly griddled 3 soft chapati breads served with homestyle dry Kadai Paneer tossed with bell peppers and onions, and a side of fresh curd.",
        price: 160,
        mealType: "Dinner",
        preference: "Veg",
        cuisine: "North Indian",
        calories: 710,
        tags: ["Veg", "High Protein"],
        ingredients: ["Whole wheat flour", "Cottage cheese (Paneer)", "Bell peppers", "Onions", "Tomatoes", "Spices", "Curd (Yoghurt)"],
        nutrition: { calories: 710, protein: "26g", carbs: "82g", fat: "19g" }
      },
      {
        id: "m1_9",
        name: "Healthy Quinoa Meal Bowl",
        description: "Super healthy, nutrient-rich diet dinner bowl. Fluffy quinoa pilaf cooked with mixed veggies, served alongside 100g of dry grilled paneer chunks, steamed sprout salad, and fresh mint yoghurt dip.",
        price: 170,
        mealType: "Dinner",
        preference: "Veg",
        cuisine: "North Indian",
        calories: 420,
        tags: ["Veg", "High Protein", "Low Oil", "Popular"],
        ingredients: ["Quinoa", "Cottage cheese (Paneer)", "Green sprouts", "Carrots", "Beans", "Mint", "Low-fat yoghurt", "Olive oil"],
        nutrition: { calories: 420, protein: "28g", carbs: "44g", fat: "12g" }
      },
      // Special Meals
      {
        id: "m1_10",
        name: "Weekend Family Pack (Serves 3-4)",
        description: "Premium weekend lunch or dinner bundle. Serves 3 to 4 family members. Includes 12 soft ghee phulkas, double portions of Paneer Tikka Masala, Veg Handi Korma, aromatic Jeera Rice, papads, pickle, salad, and 4 pieces of sweet Gulab Jamun.",
        price: 399,
        mealType: "Special Meals",
        preference: "Veg",
        cuisine: "Punjabi",
        calories: 1650,
        tags: ["Veg", "Popular"],
        ingredients: ["Cottage cheese (Paneer)", "Mixed vegetables", "Cream", "Butter", "Wheat flour", "Basmati rice", "Khoa (sweet)", "Spices"],
        nutrition: { calories: 1650, protein: "54g", carbs: "210g", fat: "58g" }
      },
      {
        id: "m1_11",
        name: "Festival Special Thali",
        description: "Festive celebration platter. Includes 5 fluffy puffed fried Puris, sweet creamy Kesar Shrikhand, homestyle dry potato bhaji, rich chickpeas masala curry (chole), basmati rice, and a crispy vegetable samosa.",
        price: 299,
        mealType: "Special Meals",
        preference: "Veg",
        cuisine: "Gujarati",
        calories: 980,
        tags: ["Veg"],
        ingredients: ["Wheat flour (Puris)", "Chakka (Shrikhand yoghurt)", "Saffron", "Potatoes", "Chickpeas", "Samosa pastry", "Oil for frying", "Spices"],
        nutrition: { calories: 980, protein: "18g", carbs: "128g", fat: "36g" }
      }
    ],
    reviews: [
      { name: "Sneha Patel", rating: 5, comment: "The Gujarati Thali is incredible! The Tuvar dal has the perfect balance of sweet and sour. Truly tastes like home.", date: "June 08, 2026" },
      { name: "Manoj Vyas", rating: 5, comment: "I appreciate the Jain option. The Jain lunch box is prepared with extreme care and zero root vegetables. Very hygienic.", date: "June 05, 2026" },
      { name: "Rohan Dave", rating: 4, comment: "The Methi Thepla is very soft and perfect for breakfast. The delivery is always on time.", date: "June 03, 2026" }
    ]
  },
  2: {
    name: "Healthy Meals Hub",
    tagline: "Dietitian-curated high protein vegetarian meals.",
    rating: 4.5,
    reviewsCount: 180,
    area: "Vallabh Vidyanagar",
    locality: "Shastri Marg",
    meals: [
      {
        id: "m2_1",
        name: "High Protein Salad Bowl",
        description: "Nutritious mix of fresh cottage cheese, boiled black chana, sprouts, cucumbers, cherry tomatoes, and bell peppers, dressed with a refreshing lemon-mint vinaigrette.",
        price: 150,
        mealType: "Lunch",
        preference: "Veg",
        cuisine: "North Indian",
        calories: 350,
        tags: ["Veg", "High Protein", "Low Oil", "Popular"],
        ingredients: ["Paneer", "Black gram sprouts", "Cucumber", "Cherry tomatoes", "Lemon juice", "Mint", "Olive oil"],
        nutrition: { calories: 350, protein: "22g", carbs: "30g", fat: "8g" }
      },
      {
        id: "m2_2",
        name: "Weight Loss Diet Tiffin",
        description: "Calorie-controlled lunch box containing 2 multigrain rotis, fiber-rich spinach paneer sabji, boiled brown rice, and thick skimmed curd.",
        price: 170,
        mealType: "Lunch",
        preference: "Veg",
        cuisine: "North Indian",
        calories: 440,
        tags: ["Veg", "Low Oil", "Popular"],
        ingredients: ["Multigrain flour", "Spinach", "Paneer (low fat)", "Brown rice", "Skimmed milk curd"],
        nutrition: { calories: 440, protein: "20g", carbs: "58g", fat: "7g" }
      },
      {
        id: "m2_3",
        name: "Oats & Lentils Khichdi",
        description: "Healthy comfort dinner bowl made with rolled oats, yellow moong dal, and loads of finely chopped carrots, beans, and peas, cooked with minimal cold-pressed oil.",
        price: 140,
        mealType: "Dinner",
        preference: "Veg",
        cuisine: "Gujarati",
        calories: 390,
        tags: ["Veg", "Jain", "Low Oil"],
        ingredients: ["Rolled oats", "Moong dal", "Carrots", "French beans", "Cumin", "Ginger"],
        nutrition: { calories: 390, protein: "14g", carbs: "62g", fat: "5g" }
      }
    ],
    reviews: [
      { name: "Dr. Anjali Shah", rating: 5, comment: "Superb portion control. The calorie logs on the box are very accurate. Perfect for my dietary needs.", date: "June 07, 2026" }
    ]
  },
  3: {
    name: "Kathiyawadi Swad Kitchen",
    tagline: "Authentic, traditional Kathiyawadi swad.",
    rating: 4.7,
    reviewsCount: 210,
    area: "Anand",
    locality: "Amul Dairy Road",
    meals: [
      {
        id: "m3_1",
        name: "Traditional Kathiyawadi Thali",
        description: "Authentic rustic dinner platter. Features 2 clay-baked thick Bajra Rotlas topped with pure ghee, smoky roasted Baingan Bharta (Ringan Oro), spicy garlic dry chutney, khichdi, kadhi, and sweet jaggery.",
        price: 160,
        mealType: "Dinner",
        preference: "Veg",
        cuisine: "Gujarati",
        calories: 780,
        tags: ["Veg", "Popular"],
        ingredients: ["Millet flour (Bajra)", "Eggplants", "Garlic", "Green chillies", "Tuvar dal", "Jaggery", "Buttermilk"],
        nutrition: { calories: 780, protein: "18g", carbs: "112g", fat: "22g" }
      },
      {
        id: "m3_2",
        name: "Sev Tameta Roti Combo",
        description: "Spicy and tangy tomato-based curry topped with fresh crispy gram flour sev. Served with 4 soft wheat chapatis and fresh buttermilk.",
        price: 130,
        mealType: "Lunch",
        preference: "Veg",
        cuisine: "Gujarati",
        calories: 520,
        tags: ["Veg"],
        ingredients: ["Tomatoes", "Gram flour (Sev)", "Spices", "Wheat flour", "Buttermilk"],
        nutrition: { calories: 520, protein: "12g", carbs: "74g", fat: "16g" }
      }
    ],
    reviews: [
      { name: "Devang Ghelani", rating: 5, comment: "Nothing beats their Ringan Oro! Very authentic smoky flavor.", date: "June 06, 2026" }
    ]
  },
  4: {
    name: "Mom's Punjabi Rasoi",
    tagline: "Ghar jaisa Punjabi khana. Butter-soft parathas and rich curries.",
    rating: 4.9,
    reviewsCount: 310,
    area: "Ahmedabad",
    locality: "Vastrapur",
    meals: [
      {
        id: "m4_1",
        name: "Rich Butter Chicken Combo",
        description: "Authentic homestyle butter chicken with tender tandoori chicken chunks simmered in a mildly sweet tomato and cashew cream gravy. Served with 3 soft butter rotis and jeera basmati rice.",
        price: 190,
        mealType: "Lunch",
        preference: "Non-Veg",
        cuisine: "Punjabi",
        calories: 890,
        tags: ["Non-Veg", "Popular", "High Protein"],
        ingredients: ["Chicken", "Butter", "Cashews", "Tomatoes", "Cream", "Wheat flour", "Basmati rice"],
        nutrition: { calories: 890, protein: "42g", carbs: "80g", fat: "38g" }
      },
      {
        id: "m4_2",
        name: "Rajma Chawal Comfort Box",
        description: "Kidney beans slow-cooked in a thick spiced tomato gravy. Served with a large portion of basmati rice, raw onion rings, and a green chilli.",
        price: 130,
        mealType: "Lunch",
        preference: "Veg",
        cuisine: "Punjabi",
        calories: 610,
        tags: ["Veg", "Popular", "Low Oil"],
        ingredients: ["Kidney beans (Rajma)", "Basmati rice", "Tomatoes", "Onions", "Ginger", "Garlic", "Spices"],
        nutrition: { calories: 610, protein: "15g", carbs: "98g", fat: "9g" }
      }
    ],
    reviews: [
      { name: "Jaspal Singh", rating: 5, comment: "Tastes exactly like my mother's rajma in Amritsar. The butter chicken is also fantastic.", date: "June 09, 2026" }
    ]
  },
  5: {
    name: "Jain Satvik Rasoi",
    tagline: "100% Satvik preparations made strictly without root vegetables.",
    rating: 4.6,
    reviewsCount: 142,
    area: "Vadodara",
    locality: "Alkapuri",
    meals: [
      {
        id: "m5_1",
        name: "Satvik Dal Khichdi Bowl",
        description: "Extremely digestable comfort meal made with yellow moong dal and rice, tempered with cumin and cow ghee. Prepared strictly without onion, garlic, or potatoes. Served with curd.",
        price: 110,
        mealType: "Dinner",
        preference: "Jain",
        cuisine: "Gujarati",
        calories: 420,
        tags: ["Veg", "Jain", "Low Oil", "Popular"],
        ingredients: ["Moong dal", "Rice", "Ghee", "Cumin", "Turmeric", "Yoghurt"],
        nutrition: { calories: 420, protein: "12g", carbs: "68g", fat: "6g" }
      }
    ],
    reviews: [
      { name: "Vikas Jain", rating: 5, comment: "It's hard to find proper Jain food that has zero garlic and onion but still tastes so good. Bless this kitchen.", date: "June 04, 2026" }
    ]
  },
  6: {
    name: "South India Express",
    tagline: "Soft idlis, crunchy vadas, and traditional Kerala/Tamil meals.",
    rating: 4.4,
    reviewsCount: 122,
    area: "Vallabh Vidyanagar",
    locality: "Amul Dairy Road",
    meals: [
      {
        id: "m6_1",
        name: "Steamed Idli Sambar Vada",
        description: "Three pillowy-soft steamed rice cakes and one crispy lentil donut fritter, served with aromatic vegetable sambar and fresh coconut chutney.",
        price: 90,
        mealType: "Breakfast",
        preference: "Veg",
        cuisine: "South Indian",
        calories: 320,
        tags: ["Veg", "Jain Option", "Low Oil", "Popular"],
        ingredients: ["Rice", "Urad dal", "Sambar vegetables (drumsticks, pumpkin)", "Tamarind", "Coconut", "Mustard seeds"],
        nutrition: { calories: 320, protein: "8g", carbs: "58g", fat: "5g" }
      }
    ],
    reviews: [
      { name: "Karthik Raja", rating: 4, comment: "Authentic Tamil style Sambar. Very low on oil, perfect breakfast.", date: "June 02, 2026" }
    ]
  },
  7: {
    name: "Student Budget Tiffins",
    tagline: "Highly affordable homestyle food tailored for university students.",
    rating: 4.3,
    reviewsCount: 195,
    area: "Vallabh Vidyanagar",
    locality: "Mota Bazar",
    meals: [
      {
        id: "m7_1",
        name: "Pocket-Saver Lunch Thali",
        description: "Budget-friendly student special. Contains 4 soft whole-wheat rotis, a generous portion of yellow dal, steamed rice, and a seasonal vegetable fry.",
        price: 90,
        mealType: "Lunch",
        preference: "Veg",
        cuisine: "Gujarati",
        calories: 580,
        tags: ["Veg", "Popular"],
        ingredients: ["Wheat flour", "Lentils", "Steamed rice", "Potatoes / Ivy gourd sabji", "Spices"],
        nutrition: { calories: 580, protein: "14g", carbs: "88g", fat: "11g" }
      }
    ],
    reviews: [
      { name: "Aman Verma", rating: 5, comment: "Super cheap and fills you up. Highly recommended for students living in Vidyanagar hostles.", date: "June 08, 2026" }
    ]
  }
};

// Reusable Skeleton Component for Meals
const MealCardSkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card animate-pulse space-y-4">
    <div className="w-full h-40 bg-slate-200 rounded-2xl"></div>
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-5 bg-slate-200 rounded-full w-12"></div>
      </div>
      <div className="h-3 bg-slate-200 rounded w-full"></div>
      <div className="h-3 bg-slate-200 rounded w-5/6"></div>
      <div className="h-4 bg-slate-200 rounded w-16 pt-1"></div>
    </div>
  </div>
);

const FilterSkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card animate-pulse space-y-6">
    <div className="h-5 bg-slate-200 rounded w-1/4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="flex space-x-2">
        <div className="h-7 bg-slate-200 rounded-lg w-16"></div>
        <div className="h-7 bg-slate-200 rounded-lg w-16"></div>
        <div className="h-7 bg-slate-200 rounded-lg w-16"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="flex space-x-2">
        <div className="h-7 bg-slate-200 rounded-lg w-16"></div>
        <div className="h-7 bg-slate-200 rounded-lg w-16"></div>
      </div>
    </div>
  </div>
);

const ReviewSkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-2xl p-4 animate-pulse space-y-2">
    <div className="flex justify-between">
      <div className="h-4 bg-slate-200 rounded w-24"></div>
      <div className="h-4 bg-slate-200 rounded w-12"></div>
    </div>
    <div className="h-3 bg-slate-200 rounded w-full"></div>
    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
  </div>
);

export default function VendorMeals() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Real data states
  const [vendor, setVendor] = useState(null);
  const [meals, setMeals] = useState([]);
  const [chefStatus, setChefStatus] = useState("Approved");
  const [isLoading, setIsLoading] = useState(true);

  const chefId = id;
  const currentChef = vendor || {
    name: "Loading Chef...",
    rating: 4.8,
    reviewsCount: 245,
    reviews: [
      { name: "Keyur Patel", rating: 5, comment: "Amazing food! Tastes exactly like homestyle cooking. Non-greasy, healthy, and Rahul Kumar delivers it warm every day.", date: "June 08, 2026" },
      { name: "Riddhi Shah", rating: 4.5, comment: "Very sanitary preparation. Love the soft phulkas. The sweet dal is a bit too sweet for me, but overall excellent quality.", date: "June 06, 2026" },
      { name: "Aarav Sharma", rating: 5, comment: "I subscribed to the monthly vegetarian package. Wholesome recipes and extremely easy to skip single dates when traveling.", date: "June 04, 2026" }
    ]
  };

  // Search & Filter State
  const [searchText, setSearchText] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("All");
  const [selectedPreference, setSelectedPreference] = useState("All");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [priceRange, setPriceRange] = useState(450);

  // Detail Modal State
  const [selectedMeal, setSelectedMeal] = useState(null);

  // Sandbox simulation toggles
  const [forceLoadingState, setForceLoadingState] = useState(false);
  const [emptyMeals, setEmptyMeals] = useState(false);
  const [emptySearch, setEmptySearch] = useState(false);
  const [emptyCategory, setEmptyCategory] = useState(false);

  // Loading simulation state tracker (replaces useEffect warning)
  const [prevFilters, setPrevFilters] = useState({
    selectedMealType,
    selectedPreference,
    selectedCuisine,
    priceRange,
    chefId
  });

  if (
    selectedMealType !== prevFilters.selectedMealType ||
    selectedPreference !== prevFilters.selectedPreference ||
    selectedCuisine !== prevFilters.selectedCuisine ||
    priceRange !== prevFilters.priceRange ||
    chefId !== prevFilters.chefId
  ) {
    setPrevFilters({
      selectedMealType,
      selectedPreference,
      selectedCuisine,
      priceRange,
      chefId
    });
    setIsLoading(true);
  }

  useEffect(() => {
    const fetchChefAndMeals = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch vendor profile
        const vendorRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/vendors/${id}`);
        if (!vendorRes.ok) {
          setChefStatus("Suspended");
          setIsLoading(false);
          return;
        }
        const vendorData = await vendorRes.json();
        if (vendorData.success && vendorData.data) {
          const v = vendorData.data;
          const mappedChef = {
            id: v._id,
            name: v.businessName || v.name || 'Vendor Kitchen',
            owner: v.name || 'Vendor Owner',
            area: v.city || 'Anand',
            locality: v.kitchenAddress || 'Anand',
            rating: 4.8,
            reviewsCount: 245,
            experience: v.mealsPerDay ? `${v.mealsPerDay} Meals/Day` : "Homestyle",
            tagline: v.description || "Fresh homemade meals prepared daily with love.",
            description: v.description || "Fresh homestyle specialties cooked daily.",
            reviews: [
              { name: "Keyur Patel", rating: 5, comment: "Amazing food! Tastes exactly like homestyle cooking. Non-greasy, healthy, and Rahul Kumar delivers it warm every day.", date: "June 08, 2026" },
              { name: "Riddhi Shah", rating: 4.5, comment: "Very sanitary preparation. Love the soft phulkas. The sweet dal is a bit too sweet for me, but overall excellent quality.", date: "June 06, 2026" },
              { name: "Aarav Sharma", rating: 5, comment: "I subscribed to the monthly vegetarian package. Wholesome recipes and extremely easy to skip single dates when traveling.", date: "June 04, 2026" }
            ]
          };
          setVendor(mappedChef);
          setChefStatus(v.verificationStatus === 'approved' ? 'Approved' : 'Pending Review');

          // 2. Fetch meals
          const mealsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/meals/vendor/${v._id}`);
          if (mealsRes.ok) {
            const mealsData = await mealsRes.json();
            const mealsArr = mealsData.success && Array.isArray(mealsData.data) ? mealsData.data : (Array.isArray(mealsData) ? mealsData : []);
            const mappedMeals = mealsArr.map(m => {
              const lowerName = m.mealName.toLowerCase();
              let resolvedMealType = "Lunch";
              if (lowerName.includes("poha") || lowerName.includes("upma") || lowerName.includes("thepla") || lowerName.includes("breakfast") || lowerName.includes("toast") || lowerName.includes("paratha")) {
                resolvedMealType = "Breakfast";
              } else if (lowerName.includes("dinner") || lowerName.includes("khichdi") || lowerName.includes("biryani") || lowerName.includes("dinner box")) {
                resolvedMealType = "Dinner";
              } else if (lowerName.includes("special") || lowerName.includes("dessert") || lowerName.includes("chaas") || lowerName.includes("shrikhand") || lowerName.includes("halwa")) {
                resolvedMealType = "Special Meals";
              }

              const resolvedPreference = m.mealType === 'Both' ? 'Veg' : (m.mealType || 'Veg');
              const resolvedCuisine = lowerName.includes("punjabi") || lowerName.includes("paneer") ? "Punjabi" : (lowerName.includes("south") || lowerName.includes("idli") || lowerName.includes("dosa") ? "South Indian" : "Gujarati");
              const resolvedTags = [resolvedPreference];
              if (m.price < 100) resolvedTags.push("Student Budget");
              if (m.price > 120) resolvedTags.push("Popular");

              return {
                id: m._id,
                name: m.mealName,
                description: m.description || 'No description available.',
                price: m.price,
                mealType: resolvedMealType,
                preference: resolvedPreference,
                cuisine: resolvedCuisine,
                tags: resolvedTags,
                calories: 450,
                ingredients: [m.description || 'Fresh ingredients'],
                nutrition: { calories: 450, protein: "12g", carbs: "55g", fat: "10g" }
              };
            });
            setMeals(mappedMeals);
          }
        } else {
          setChefStatus("Suspended");
        }
      } catch (err) {
        console.error("Failed to fetch chef and meals:", err);
        setChefStatus("Suspended");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChefAndMeals();
  }, [id]);

  // Derived filter logic
  const mealsSource = emptyMeals ? [] : meals;

  if (chefStatus !== "Approved") {
    return (
      <div className="min-h-screen bg-snow flex flex-col justify-between font-sans">
        <header className="bg-white border-b border-slate-200/60 sticky top-0 z-35 font-semibold">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={() => navigate('/browse-vendors')} className="flex items-center space-x-2 text-slate-600 hover:text-primary-text font-bold text-xs cursor-pointer border-0 bg-transparent">
              <ArrowLeft size={16} />
              <span>Back to Marketplace</span>
            </button>
          </div>
        </header>
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-primary-text font-bold">Menu Locked</h1>
            <p className="text-xs text-secondary-text leading-relaxed">
              This vendor kitchen is currently undergoing platform verification (FSSAI/hygiene audit) or is temporarily suspended. Menus are currently locked.
            </p>
          </div>
          <button
            onClick={() => navigate('/browse-vendors')}
            className="px-5 py-2.5 bg-mint hover:bg-mint-hover text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm font-bold"
          >
            Browse Other Home Chefs
          </button>
        </div>
      </div>
    );
  }

  const filteredMeals = emptySearch ? [] : mealsSource.filter(meal => {
    const matchesSearch = searchText ? (
      meal.name.toLowerCase().includes(searchText.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchText.toLowerCase()) ||
      meal.cuisine.toLowerCase().includes(searchText.toLowerCase()) ||
      meal.mealType.toLowerCase().includes(searchText.toLowerCase())
    ) : true;

    const matchesMealType = selectedMealType !== "All" ? meal.mealType === selectedMealType : true;
    const matchesPreference = selectedPreference !== "All" ? (
      selectedPreference === "Jain" ? meal.preference === "Jain" : meal.preference === selectedPreference
    ) : true;
    const matchesCuisine = selectedCuisine !== "All" ? meal.cuisine === selectedCuisine : true;
    const matchesPrice = meal.price <= priceRange;

    return matchesSearch && matchesMealType && matchesPreference && matchesCuisine && matchesPrice;
  });

  const finalFilteredMeals = emptyCategory ? [] : filteredMeals;

  // Split meals into active render sections
  const breakfastMeals = finalFilteredMeals.filter(m => m.mealType === "Breakfast");
  const lunchMeals = finalFilteredMeals.filter(m => m.mealType === "Lunch");
  const dinnerMeals = finalFilteredMeals.filter(m => m.mealType === "Dinner");
  const specialMeals = finalFilteredMeals.filter(m => m.mealType === "Special Meals");

  // Popular meals filter
  const popularMeals = finalFilteredMeals.filter(m => m.tags.includes("Popular"));

  const activeLoading = isLoading || forceLoadingState;

  return (
    <div className="min-h-screen bg-snow text-primary-text font-sans flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/customer-dashboard')}
              className="p-1.5 text-secondary-text hover:text-primary-text rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center shadow-sm">
                <Utensils className="text-white" size={16} strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-primary-text">
                Tiffin<span className="text-mint">Track</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Developer Sandbox Controls */}
            <div className="hidden lg:flex items-center space-x-4 border border-slate-200/50 bg-slate-50 px-3 py-1.5 rounded-xl text-[10px]">
              <span className="font-bold text-secondary-text uppercase tracking-wider text-[9px]">Mock Sandbox:</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={forceLoadingState} 
                  onChange={(e) => setForceLoadingState(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>Skeletons</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyMeals} 
                  onChange={(e) => setEmptyMeals(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>No Meals</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptySearch} 
                  onChange={(e) => setEmptySearch(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>No Search Match</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyCategory} 
                  onChange={(e) => setEmptyCategory(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>No Filter Match</span>
              </label>
            </div>
            
            <button 
              onClick={() => navigate(`/vendor/${chefId}/plans`)}
              className="px-4 py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition-all duration-150 shadow-sm cursor-pointer"
            >
              View Subscription Plans
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 flex-grow space-y-6">
        
        {/* Banner Hero Info */}
        <div className="bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-mint/5 rounded-full pointer-events-none"></div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-mint bg-mint-light px-2.5 py-1 rounded-md border border-mint/10 uppercase tracking-wider">
                Home Kitchen Menu
              </span>
              <span className="text-xs text-amber-500 font-semibold flex items-center bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                <Star size={12} fill="#F59E0B" className="mr-1" />
                {currentChef.rating} ({currentChef.reviewsCount} reviews)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-primary-text tracking-tight">
              {currentChef.name}
            </h1>
            <p className="text-xs md:text-sm text-secondary-text max-w-2xl leading-relaxed">
              Explore freshly prepared home-cooked meals available for subscription and daily ordering.
            </p>
          </div>
          <button 
            onClick={() => navigate(`/vendor/${chefId}/plans`)}
            className="w-full md:w-auto px-5 py-3 bg-mint hover:bg-mint-hover text-white text-xs font-extrabold rounded-xl transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer shadow-sm shadow-mint/10 whitespace-nowrap"
          >
            <span>View Subscription Plans</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Explore</span>
          </button>
        </div>

        {/* Filters and Food List Deck */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left filter side column */}
          <div className="lg:col-span-3 space-y-4">
            {activeLoading ? (
              <FilterSkeleton />
            ) : (
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center">
                    <SlidersHorizontal size={14} className="text-mint mr-2" />
                    Filters
                  </h3>
                  <button 
                    onClick={() => {
                      setSearchText("");
                      setSelectedMealType("All");
                      setSelectedPreference("All");
                      setSelectedCuisine("All");
                      setPriceRange(450);
                    }}
                    className="text-[10px] font-bold text-mint hover:text-mint-hover cursor-pointer"
                  >
                    Reset All
                  </button>
                </div>

                {/* Search meal filter input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wider">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-350" size={14} />
                    <input 
                      type="text"
                      placeholder="Search meals, cuisines..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint placeholder-slate-400 bg-snow font-medium"
                    />
                  </div>
                </div>

                {/* Preference Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wider">Food Preference</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", "Veg", "Non-Veg", "Jain"].map((pref) => (
                      <button
                        key={pref}
                        onClick={() => setSelectedPreference(pref)}
                        className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                          selectedPreference === pref 
                            ? 'bg-mint border-mint text-white' 
                            : 'bg-snow border-slate-200 text-slate-650 hover:bg-slate-100'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meal Type Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wider">Meal Cycle</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", "Breakfast", "Lunch", "Dinner", "Special Meals"].map((cycle) => (
                      <button
                        key={cycle}
                        onClick={() => setSelectedMealType(cycle)}
                        className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                          selectedMealType === cycle 
                            ? 'bg-mint border-mint text-white' 
                            : 'bg-snow border-slate-200 text-slate-650 hover:bg-slate-100'
                        }`}
                      >
                        {cycle === "Special Meals" ? "Specials" : cycle}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cuisine Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wider">Cuisine Style</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", "Gujarati", "Punjabi", "South Indian", "North Indian"].map((cui) => (
                      <button
                        key={cui}
                        onClick={() => setSelectedCuisine(cui)}
                        className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                          selectedCuisine === cui 
                            ? 'bg-mint border-mint text-white' 
                            : 'bg-snow border-slate-200 text-slate-650 hover:bg-slate-100'
                        }`}
                      >
                        {cui}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range filter */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-secondary-text uppercase tracking-wider">
                    <span>Max Price</span>
                    <span className="text-mint font-black text-xs">₹{priceRange}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="450" 
                    step="10"
                    value={priceRange} 
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-mint"
                  />
                  <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                    <span>₹50</span>
                    <span>₹450</span>
                  </div>
                </div>

              </div>
            )}

            {/* Why Customers Love These Meals */}
            <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
              <div className="border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center">
                  <ThumbsUp size={13} className="text-mint mr-2" />
                  Why Customers Love Us
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  { title: "Fresh Ingredients", desc: "Sourced locally every morning." },
                  { title: "Homemade Taste", desc: "No artificial enhancers or MSG." },
                  { title: "Balanced Nutrition", desc: "Right ratios of protein & fiber." },
                  { title: "Prepared Daily", desc: "Cooked clean, delivered warm." }
                ].map((item) => (
                  <div key={item.title} className="text-xs">
                    <h4 className="font-extrabold text-slate-700">{item.title}</h4>
                    <p className="text-[10px] text-secondary-text mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right main menu column */}
          <div className="lg:col-span-9 space-y-6">

            {/* POPULAR MEALS CORNER HIGHLIGHT */}
            {popularMeals.length > 0 && !activeLoading && (
              <div className="space-y-3">
                <h2 className="text-sm font-extrabold text-primary-text uppercase tracking-wider flex items-center">
                  <Flame size={16} className="text-amber-500 mr-2" />
                  Most Popular Choices
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {popularMeals.slice(0, 2).map((meal) => (
                    <div 
                      key={meal.id}
                      onClick={() => setSelectedMeal(meal)}
                      className="bg-white border border-slate-250/60 rounded-3xl p-5 shadow-card hover:border-mint/20 hover:shadow-card-hover transition-all duration-200 cursor-pointer flex justify-between gap-4 relative overflow-hidden group"
                    >
                      <div className="absolute right-0 top-0 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                        Popular
                      </div>
                      
                      <div className="space-y-3 flex-grow max-w-[70%]">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase">{meal.cuisine} • {meal.mealType}</span>
                          <h3 className="text-sm font-black text-primary-text leading-tight group-hover:text-mint transition-colors truncate">
                            {meal.name}
                          </h3>
                          <p className="text-[11px] text-secondary-text line-clamp-2 leading-relaxed">
                            {meal.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[9px] font-bold text-mint bg-mint-light px-2 py-0.5 rounded-full uppercase">
                            {meal.preference}
                          </span>
                          <span className="text-[9px] text-secondary-text bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
                            {meal.calories} kcal
                          </span>
                          <span className="text-[9px] text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-bold">
                            ⭐ 4.9 (80+ orders)
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-snow border border-slate-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200">
                          <Utensils size={24} className="text-mint/40" />
                        </div>
                        <span className="text-sm font-black text-mint bg-mint-light px-3 py-1.5 rounded-xl border border-mint/10">
                          ₹{meal.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FOOD CATEGORIES GRID */}
            {activeLoading ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-28 animate-pulse"></div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <MealCardSkeleton />
                    <MealCardSkeleton />
                    <MealCardSkeleton />
                  </div>
                </div>
              </div>
            ) : (
              finalFilteredMeals.length === 0 ? (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-16 shadow-card text-center flex flex-col items-center justify-center min-h-[350px]">
                  <Inbox size={48} className="text-slate-300 mb-3" />
                  <h3 className="text-base font-bold text-primary-text">No Meals Available</h3>
                  <p className="text-xs text-secondary-text max-w-sm mt-1 leading-relaxed">
                    No home-cooked dishes match your selected filter options. Try adjusting the tags, pricing slider, or search term in the filter column.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchText("");
                      setSelectedMealType("All");
                      setSelectedPreference("All");
                      setSelectedCuisine("All");
                      setPriceRange(450);
                    }}
                    className="mt-6 px-4 py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  
                  {/* BREAKFAST SECTION */}
                  {breakfastMeals.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                        🍳 Breakfast Menu ({breakfastMeals.length})
                      </h2>
                      <div className="grid md:grid-cols-3 gap-4">
                        {breakfastMeals.map((meal) => (
                          <div 
                            key={meal.id}
                            onClick={() => setSelectedMeal(meal)}
                            className="bg-white border border-slate-200/60 rounded-3xl p-4.5 shadow-card hover:border-mint/20 hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between h-[230px] group"
                          >
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] font-black text-mint bg-mint-light px-2 py-0.5 rounded-full uppercase border border-mint/5">
                                  {meal.preference}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase">{meal.cuisine}</span>
                              </div>
                              
                              <h3 className="text-xs font-extrabold text-primary-text leading-tight group-hover:text-mint transition-colors line-clamp-1">
                                {meal.name}
                              </h3>
                              <p className="text-[10px] text-secondary-text leading-relaxed line-clamp-3">
                                {meal.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                              <span className="text-[10px] text-slate-400 font-semibold">{meal.calories} kcal</span>
                              <span className="text-xs font-black text-mint">₹{meal.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LUNCH SECTION */}
                  {lunchMeals.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                        🍱 Lunch Menu ({lunchMeals.length})
                      </h2>
                      <div className="grid md:grid-cols-3 gap-4">
                        {lunchMeals.map((meal) => (
                          <div 
                            key={meal.id}
                            onClick={() => setSelectedMeal(meal)}
                            className="bg-white border border-slate-200/60 rounded-3xl p-4.5 shadow-card hover:border-mint/20 hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between h-[230px] group"
                          >
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] font-black text-mint bg-mint-light px-2 py-0.5 rounded-full uppercase border border-mint/5">
                                  {meal.preference}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase">{meal.cuisine}</span>
                              </div>
                              
                              <h3 className="text-xs font-extrabold text-primary-text leading-tight group-hover:text-mint transition-colors line-clamp-1">
                                {meal.name}
                              </h3>
                              <p className="text-[10px] text-secondary-text leading-relaxed line-clamp-3">
                                {meal.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                              <span className="text-[10px] text-slate-400 font-semibold">{meal.calories} kcal</span>
                              <span className="text-xs font-black text-mint">₹{meal.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DINNER SECTION */}
                  {dinnerMeals.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                        🌙 Dinner Menu ({dinnerMeals.length})
                      </h2>
                      <div className="grid md:grid-cols-3 gap-4">
                        {dinnerMeals.map((meal) => (
                          <div 
                            key={meal.id}
                            onClick={() => setSelectedMeal(meal)}
                            className="bg-white border border-slate-200/60 rounded-3xl p-4.5 shadow-card hover:border-mint/20 hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between h-[230px] group"
                          >
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] font-black text-mint bg-mint-light px-2 py-0.5 rounded-full uppercase border border-mint/5">
                                  {meal.preference}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase">{meal.cuisine}</span>
                              </div>
                              
                              <h3 className="text-xs font-extrabold text-primary-text leading-tight group-hover:text-mint transition-colors line-clamp-1">
                                {meal.name}
                              </h3>
                              <p className="text-[10px] text-secondary-text leading-relaxed line-clamp-3">
                                {meal.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                              <span className="text-[10px] text-slate-400 font-semibold">{meal.calories} kcal</span>
                              <span className="text-xs font-black text-mint">₹{meal.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SPECIAL MEALS SECTION */}
                  {specialMeals.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                        ✨ Weekend Specials & Festival Packs ({specialMeals.length})
                      </h2>
                      <div className="grid md:grid-cols-3 gap-4">
                        {specialMeals.map((meal) => (
                          <div 
                            key={meal.id}
                            onClick={() => setSelectedMeal(meal)}
                            className="bg-white border border-slate-200/60 rounded-3xl p-4.5 shadow-card hover:border-mint/20 hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between h-[230px] group"
                          >
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] font-black text-mint bg-mint-light px-2 py-0.5 rounded-full uppercase border border-mint/5">
                                  {meal.preference}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase">{meal.cuisine}</span>
                              </div>
                              
                              <h3 className="text-xs font-extrabold text-primary-text leading-tight group-hover:text-mint transition-colors line-clamp-1">
                                {meal.name}
                              </h3>
                              <p className="text-[10px] text-secondary-text leading-relaxed line-clamp-3">
                                {meal.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                              <span className="text-[10px] text-slate-400 font-semibold">{meal.calories} kcal</span>
                              <span className="text-xs font-black text-mint">₹{meal.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )
            )}

            {/* CUSTOMER REVIEWS FEED */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-primary-text uppercase tracking-wider">
                  Verified Customer Reviews on Meals
                </h3>
                <p className="text-[10px] text-secondary-text">Feedback left by active plan subscribers who ordered these items.</p>
              </div>

              {activeLoading ? (
                <div className="space-y-3">
                  <ReviewSkeleton />
                  <ReviewSkeleton />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {currentChef.reviews.map((rev, index) => (
                    <div key={index} className="p-4 bg-snow border border-slate-150 rounded-2xl space-y-1.5 text-xs text-secondary-text leading-relaxed">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">{rev.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            fill={i < Math.floor(rev.rating) ? "#F59E0B" : "none"} 
                            className={i < Math.floor(rev.rating) ? "text-amber-500" : "text-slate-350"} 
                          />
                        ))}
                      </div>
                      <p className="italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QUICK CTA FOOTER CARD */}
            <div className="bg-white border-2 border-mint/10 rounded-3xl p-6 shadow-card flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <div>
                <h3 className="text-sm font-extrabold text-primary-text">Ready to Subscribe?</h3>
                <p className="text-[11px] text-secondary-text mt-0.5">Choose an affordable recurring weekly or monthly package and enjoy fresh food daily.</p>
              </div>
              <button 
                onClick={() => navigate(`/vendor/${chefId}/plans`)}
                className="w-full md:w-auto px-5 py-2.5 bg-mint hover:bg-mint-hover text-white text-[11px] font-black rounded-xl shadow-sm cursor-pointer transition-colors"
              >
                Explore Subscription Packages
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Global Page Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-secondary-text text-xs mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TiffinTrack. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-text transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* MEAL DETAILS POPUP MODAL */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-scale-up">
            
            {/* Modal Image Header placeholder */}
            <div className="h-40 bg-mint-light p-6 flex flex-col justify-end relative">
              <button 
                onClick={() => setSelectedMeal(null)}
                className="absolute top-4 right-4 p-1.5 bg-white/80 hover:bg-white text-slate-600 rounded-full cursor-pointer transition-colors shadow-sm"
              >
                <X size={16} />
              </button>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-mint bg-white px-2 py-0.5 rounded-full uppercase border border-mint/10 w-fit block">
                  {selectedMeal.preference}
                </span>
                <h2 className="text-lg font-black text-primary-text leading-tight mt-1">{selectedMeal.name}</h2>
              </div>
            </div>

            {/* Modal Body Info */}
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Description</h3>
                <p className="text-xs text-secondary-text leading-relaxed">
                  {selectedMeal.description}
                </p>
              </div>

              {/* Ingredients */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Ingredients</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMeal.ingredients.map((ing, idx) => (
                    <span key={idx} className="text-[10px] font-medium text-slate-600 bg-snow border border-slate-150 px-2.5 py-1 rounded-lg">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nutrition Breakdown Grid */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Nutritional Information</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Calories", value: `${selectedMeal.nutrition.calories} kcal`, color: 'bg-amber-50 text-amber-700 border-amber-100' },
                    { label: "Protein", value: selectedMeal.nutrition.protein, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                    { label: "Carbohydrates", value: selectedMeal.nutrition.carbs, color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                    { label: "Fats", value: selectedMeal.nutrition.fat, color: 'bg-rose-50 text-rose-700 border-rose-100' }
                  ].map((nut) => (
                    <div key={nut.label} className={`p-2 border rounded-xl text-center ${nut.color}`}>
                      <span className="text-[8px] font-extrabold uppercase block text-slate-400">{nut.label}</span>
                      <span className="text-[10px] font-black mt-0.5 block">{nut.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details stack */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[9px] font-extrabold text-slate-450 block uppercase">Cuisine Type</span>
                  <span className="font-extrabold text-primary-text">{selectedMeal.cuisine}</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-slate-450 block uppercase">Price</span>
                  <span className="text-sm font-black text-mint">₹{selectedMeal.price}</span>
                </div>
              </div>

            </div>

            {/* Modal Action CTA */}
            <div className="bg-snow px-6 py-4 flex justify-between gap-3 border-t border-slate-150/60">
              <button 
                onClick={() => setSelectedMeal(null)}
                className="flex-1 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Menu
              </button>
              <button 
                onClick={() => {
                  setSelectedMeal(null);
                  navigate(`/vendor/${chefId}/plans`);
                }}
                className="flex-1 py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
              >
                Explore Plans
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
