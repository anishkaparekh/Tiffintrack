import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { PlanItem, PlanStatus } from '../../../types/plans';
import { mockAvailableMeals } from '../../../data/plansMockData';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<PlanItem, 'id' | 'subscriberCount' | 'revenueGenerated'>) => void;
  editPlan?: PlanItem | null;
}

export default function CreatePlanModal({ isOpen, onClose, onSave, editPlan }: CreatePlanModalProps) {
  const [name, setName] = useState(editPlan ? editPlan.name : '');
  const [description, setDescription] = useState(editPlan ? editPlan.description : '');
  const [mealsPerWeek, setMealsPerWeek] = useState(editPlan ? editPlan.mealsPerWeek : '6 Meals');
  const [monthlyPrice, setMonthlyPrice] = useState(editPlan ? editPlan.monthlyPrice.replace(/[^\d]/g, '') : '2800');
  const [duration, setDuration] = useState(editPlan ? editPlan.duration : 'Monthly');
  const [status, setStatus] = useState<PlanStatus>(editPlan ? editPlan.status : 'Active');
  const [maxSubscribers, setMaxSubscribers] = useState('100');

  // Multi-select state for meals
  const [selectedMeals, setSelectedMeals] = useState<string[]>(
    editPlan && editPlan.includedMeals ? editPlan.includedMeals : []
  );

  React.useEffect(() => {
    if (editPlan) {
      setName(editPlan.name);
      setDescription(editPlan.description);
      setMealsPerWeek(editPlan.mealsPerWeek);
      setMonthlyPrice(editPlan.monthlyPrice.replace(/[^\d]/g, ''));
      setDuration(editPlan.duration);
      setStatus(editPlan.status);
      setSelectedMeals(editPlan.includedMeals || []);
    } else {
      setName('');
      setDescription('');
      setMealsPerWeek('6 Meals');
      setMonthlyPrice('2800');
      setDuration('Monthly');
      setStatus('Active');
      setSelectedMeals([]);
    }
  }, [editPlan, isOpen]);

  if (!isOpen) return null;

  const handleMealToggle = (mealName: string) => {
    if (selectedMeals.includes(mealName)) {
      setSelectedMeals(selectedMeals.filter(m => m !== mealName));
    } else {
      setSelectedMeals([...selectedMeals, mealName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;
    
    const formattedPrice = monthlyPrice === 'Custom' || !monthlyPrice
      ? 'Custom Pricing'
      : `₹${parseInt(monthlyPrice).toLocaleString()}/month`;

    onSave({
      name,
      description,
      includedMeals: selectedMeals,
      mealsPerWeek,
      monthlyPrice: formattedPrice,
      duration,
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[#E5E7EB] animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#1F2937]">
            {editPlan ? 'Configure Subscription Plan' : 'Create New Meal Plan'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-[#1F2937] hover:bg-[#FFF8E7] rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-500 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Plan Name */}
            <div className="space-y-1 sm:col-span-2">
              <label className="uppercase tracking-wider">Plan Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                placeholder="e.g. Lunch Only Plan"
              />
            </div>

            {/* Meals per week */}
            <div className="space-y-1">
              <label className="uppercase tracking-wider">Meals Per Week</label>
              <input
                type="text"
                required
                value={mealsPerWeek}
                onChange={(e) => setMealsPerWeek(e.target.value)}
                className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                placeholder="e.g. 6 Meals"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="uppercase tracking-wider">Monthly Price (₹)</label>
              <input
                type="number"
                required
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
                className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                placeholder="Billed monthly rate"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="uppercase tracking-wider">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white cursor-pointer"
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {/* Max Subscribers */}
            <div className="space-y-1">
              <label className="uppercase tracking-wider">Max Subscribers Limit</label>
              <input
                type="number"
                required
                value={maxSubscribers}
                onChange={(e) => setMaxSubscribers(e.target.value)}
                className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
              />
            </div>

            {/* Status */}
            <div className="space-y-1 sm:col-span-2">
              <label className="uppercase tracking-wider">Plan Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PlanStatus)}
                className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white min-h-[60px] resize-none"
              placeholder="Provide a brief explanation of subscription inclusions..."
            />
          </div>

          {/* Multi-select Meals List */}
          <div className="space-y-2">
            <label className="uppercase tracking-wider block">Select Included Menu Meals</label>
            <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl">
              {mockAvailableMeals.map((meal) => {
                const isSelected = selectedMeals.includes(meal);
                return (
                  <button
                    key={meal}
                    type="button"
                    onClick={() => handleMealToggle(meal)}
                    className={`p-2 rounded-lg border text-left text-[11px] font-semibold flex items-center justify-between transition-all ${
                      isSelected 
                        ? 'border-[#F59E0B] bg-white text-[#F59E0B]' 
                        : 'border-[#E5E7EB] bg-white text-slate-600 hover:bg-stone-50'
                    }`}
                  >
                    <span className="truncate">{meal}</span>
                    {isSelected && <Check size={12} className="text-[#F59E0B] shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#FFF8E7] text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/95 text-white font-bold text-xs shadow-md shadow-[#F59E0B]/15 transition-all cursor-pointer"
            >
              {editPlan ? 'Save Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
