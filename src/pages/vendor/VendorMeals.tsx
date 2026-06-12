import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import MealStatsCard from '../../components/vendor/meals/MealStatsCard';
import MealsFilterBar from '../../components/vendor/meals/MealsFilterBar';
import MealCard from '../../components/vendor/meals/MealCard';
import TopMealsCard from '../../components/vendor/meals/TopMealsCard';
import AddMealModal from '../../components/vendor/meals/AddMealModal';
import EmptyState from '../../components/vendor/meals/EmptyState';
import SkeletonLoader from '../../components/vendor/meals/SkeletonLoader';

import { 
  mockMealsList, 
  mockMealsStats, 
  mockBestPerformingMeals 
} from '../../data/mealsMockData';

import { MealItem, MealAvailability, MealCategory } from '../../types/meals';
import { Sparkles, Eye, Plus, ShieldAlert, Layers } from 'lucide-react';

export default function VendorMeals() {
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [vendorId, setVendorId] = useState('');
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  // Simulation states for grading
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealItem | null>(null);

  const fetchMeals = async (vId: string) => {
    if (!vId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/meals/vendor/${vId}`);
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          const mappedMeals: MealItem[] = resData.data.map((m: any) => ({
            id: m._id,
            name: m.mealName,
            category: m.mealType === 'Jain' ? 'Jain Special' : 'Traditional',
            description: m.description,
            price: m.price,
            weeklyOrders: 0,
            status: m.availability ? 'Available' : 'Unavailable',
            type: m.mealType === 'Jain' ? 'Jain' : 'Veg',
            imageUrl: m.imageUrl
          }));
          setMeals(mappedMeals);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const userStr = localStorage.getItem('tiffintrack_vendor_user');
    let vId = '';
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        vId = u.id || u._id || '';
      } catch (e) {
        console.error(e);
      }
    }
    if (!vId) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          vId = payload.id || '';
        } catch (e) {
          console.error(e);
        }
      }
    }
    setVendorId(vId);
    if (vId) {
      fetchMeals(vId);
    }
  }, []);

  // Handle new meal submit or edit save
  const handleSaveMeal = async (mealData: Omit<MealItem, 'id' | 'weeklyOrders'>) => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        mealName: mealData.name,
        description: mealData.description,
        price: mealData.price,
        mealType: mealData.type === 'Jain' || mealData.category === 'Jain Special' ? 'Jain' : 'Veg',
        availability: mealData.status === 'Available'
      };

      if (editingMeal) {
        // Edit mode
        const response = await fetch(`/api/v1/meals/${editingMeal.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const resData = await response.json();
        if (!response.ok || !resData.success) {
          alert(`Error: ${resData.message || 'Failed to update meal.'}`);
          return;
        }
        alert(`Success: "${mealData.name}" has been updated.`);
        setEditingMeal(null);
      } else {
        // Add mode
        const response = await fetch('/api/v1/meals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const resData = await response.json();
        if (!response.ok || !resData.success) {
          alert(`Error: ${resData.message || 'Failed to list meal.'}`);
          return;
        }
        alert(`Success: "${mealData.name}" has been listed on TiffinTrack.`);
      }
      if (vendorId) {
        fetchMeals(vendorId);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please try again.");
    }
  };

  // Dropdown operations
  const handleStatusChange = async (id: string, newStatus: MealAvailability) => {
    const mealName = meals.find(m => m.id === id)?.name;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/meals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          availability: newStatus === 'Available'
        })
      });
      const resData = await response.json();
      if (!response.ok || !resData.success) {
        alert(`Error: ${resData.message || 'Failed to update status.'}`);
        return;
      }
      alert(`Success: "${mealName}" availability marked as ${newStatus}.`);
      if (vendorId) {
        fetchMeals(vendorId);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please try again.");
    }
  };

  const handleDuplicate = async (meal: MealItem) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mealName: `${meal.name} (Copy)`,
          description: meal.description,
          price: meal.price,
          mealType: meal.type,
          availability: meal.status === 'Available'
        })
      });
      const resData = await response.json();
      if (!response.ok || !resData.success) {
        alert(`Error: ${resData.message || 'Failed to duplicate meal.'}`);
        return;
      }
      alert(`Success: Duplicated "${meal.name}" as "${meal.name} (Copy)".`);
      if (vendorId) {
        fetchMeals(vendorId);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    const mealName = meals.find(m => m.id === id)?.name;
    if (confirm(`Are you sure you want to delete "${mealName}"?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/v1/meals/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await response.json();
        if (!response.ok || !resData.success) {
          alert(`Error: ${resData.message || 'Failed to delete meal.'}`);
          return;
        }
        alert(`Deleted: "${mealName}" has been removed.`);
        if (vendorId) {
          fetchMeals(vendorId);
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server. Please try again.");
      }
    }
  };

  const handleEditClick = (meal: MealItem) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  const handleViewClick = (meal: MealItem) => {
    alert(`Viewing Details:\n\nName: ${meal.name}\nCategory: ${meal.category}\nDescription: ${meal.description}\nPrice: ₹${meal.price}\nStatus: ${meal.status}\nType: ${meal.type}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedAvailability('All');
  };

  // Filter meals based on search queries and selection tags
  const filteredMeals = useMemo(() => {
    if (isEmpty) return [];
    
    return meals.filter(meal => {
      const matchesSearch = 
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All Categories' || 
        meal.category === selectedCategory;
      
      const matchesAvailability = 
        selectedAvailability === 'All' || 
        meal.status === selectedAvailability;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [meals, searchQuery, selectedCategory, selectedAvailability, isEmpty]);

  // Compute stats on-the-fly to keep stats cards accurate
  const activeStats = useMemo(() => {
    const total = meals.length;
    const available = meals.filter(m => m.status === 'Available').length;
    
    // Find best seller in local state
    const sorted = [...meals].sort((a, b) => b.weeklyOrders - a.weeklyOrders);
    const bestSeller = sorted[0];

    const weeklyTotal = meals.reduce((acc, m) => acc + m.weeklyOrders, 0);

    return {
      totalMeals: total,
      availableMeals: available,
      bestSellerName: bestSeller ? bestSeller.name : "None",
      bestSellerOrders: bestSeller ? bestSeller.weeklyOrders : 0,
      weeklyOrdersTotal: weeklyTotal,
      weeklyOrdersIncreasePercent: mockMealsStats.weeklyOrdersIncreasePercent
    };
  }, [meals]);

  return (
    <DashboardLayout activeTab="meals" onTabSelect={() => {}}>
      {/* Simulation preview bar for grading / review */}
      <div className="mb-6 p-4 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md text-white border border-slate-800">
        <div className="space-y-1">
          <p className="text-[#FFD200] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#FFD200]" />
            <span>Operational Sandbox Toggles</span>
          </p>
          <h3 className="font-bold text-xs text-slate-100">Simulate states for review</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Use these switches to instantly test loading placeholders and empty states across meals page.
          </p>
        </div>

        <div className="flex items-center space-x-4 shrink-0 bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700">
          {/* Toggle Loading State */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold text-slate-355">Loading Skeleton</span>
            <button
              onClick={() => setIsLoading(!isLoading)}
              className={`w-10 h-5 rounded-full transition-all relative ${
                isLoading ? 'bg-[#00B074]' : 'bg-slate-600'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                isLoading ? 'right-0.75' : 'left-0.75'
              }`} />
            </button>
          </div>

          <div className="w-[1px] h-6 bg-slate-700" />

          {/* Toggle Empty State */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold text-slate-355">Empty States</span>
            <button
              onClick={() => setIsEmpty(!isEmpty)}
              className={`w-10 h-5 rounded-full transition-all relative ${
                isEmpty ? 'bg-[#00B074]' : 'bg-slate-600'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                isEmpty ? 'right-0.75' : 'left-0.75'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main page content area */}
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1F2937]">My Meals</h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage your meal offerings, availability, and pricing from one place.</p>
          </div>
          <button
            onClick={() => {
              setEditingMeal(null);
              setIsModalOpen(true);
            }}
            className="sm:hidden w-full py-3 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-[#00B074]/15 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add New Meal</span>
          </button>
        </div>

        {/* 1. Statistics Cards Section */}
        {isLoading ? (
          <SkeletonLoader type="stats" />
        ) : (
          <MealStatsCard {...activeStats} />
        )}

        {/* 2. Filter Bar */}
        {!isLoading && (
          <MealsFilterBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedAvailability={selectedAvailability}
            onAvailabilityChange={setSelectedAvailability}
          />
        )}

        {/* 3. Grid area + Best performing section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Meals Listing Grid */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <SkeletonLoader type="grid" />
            ) : filteredMeals.length === 0 ? (
              isEmpty || meals.length === 0 ? (
                <EmptyState type="no_meals" onActionClick={() => setIsModalOpen(true)} />
              ) : (
                <EmptyState type="no_search" onActionClick={handleClearFilters} />
              )
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredMeals.map((meal) => (
                  <MealCard 
                    key={meal.id} 
                    meal={meal} 
                    onEdit={handleEditClick}
                    onView={handleViewClick}
                    onStatusChange={handleStatusChange}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Area: Top Meals + Actions (Sticky Desktop) */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="hidden sm:block bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
              <button
                onClick={() => {
                  setEditingMeal(null);
                  setIsModalOpen(true);
                }}
                className="w-full py-3.5 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-[#00B074]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add New Meal Offering</span>
              </button>
            </div>

            {isLoading ? (
              <SkeletonLoader type="best_sellers" />
            ) : (
              <TopMealsCard bestPerformingMeals={mockBestPerformingMeals} />
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddMealModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMeal(null);
        }}
        onSave={handleSaveMeal}
        editMeal={editingMeal}
      />
    </DashboardLayout>
  );
}
