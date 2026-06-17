import React, { useState } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { MealItem, MealCategory, MealAvailability, MealDietType } from '../../../types/meals';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meal: Omit<MealItem, 'id' | 'weeklyOrders'>) => void;
  editMeal?: MealItem | null;
}

const categories: MealCategory[] = [
  "Traditional",
  "Jain Special",
  "North Indian",
  "South Indian",
  "Healthy Meals",
  "Family Specials",
  "Snacks",
  "Beverages"
];

export default function AddMealModal({ isOpen, onClose, onSave, editMeal }: AddMealModalProps) {
  const [name, setName] = useState(editMeal ? editMeal.name : '');
  const [category, setCategory] = useState<MealCategory>(editMeal ? editMeal.category : 'Traditional');
  const [description, setDescription] = useState(editMeal ? editMeal.description : '');
  const [price, setPrice] = useState(editMeal ? editMeal.price : 120);
  const [type, setType] = useState<MealDietType>(editMeal ? editMeal.type : 'Veg');
  const [status, setStatus] = useState<MealAvailability>(editMeal ? editMeal.status : 'Available');
  const [uploadProgress, setUploadProgress] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  React.useEffect(() => {
    if (editMeal) {
      setName(editMeal.name);
      setCategory(editMeal.category);
      setDescription(editMeal.description);
      setPrice(editMeal.price);
      setType(editMeal.type);
      setStatus(editMeal.status);
      setImageUploaded(true);
    } else {
      setName('');
      setCategory('Traditional');
      setDescription('');
      setPrice(120);
      setType('Veg');
      setStatus('Available');
      setImageUploaded(false);
    }
  }, [editMeal, isOpen]);

  if (!isOpen) return null;

  const handleUploadSimulate = () => {
    setUploadProgress(true);
    setTimeout(() => {
      setUploadProgress(false);
      setImageUploaded(true);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;
    onSave({
      name,
      category,
      description,
      price,
      type,
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
            {editMeal ? 'Edit Meal Parameters' : 'List New Specialty Meal'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-[#1F2937] hover:bg-[#FFF8E7] rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Meal Name */}
            <div className="space-y-1 sm:col-span-2">
              <label className="uppercase tracking-wider">Meal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                placeholder="e.g. Gujarati Special Thali"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MealCategory)}
                className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="uppercase tracking-wider">Price (₹)</label>
              <input
                type="number"
                required
                min={10}
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
              />
            </div>

            {/* Meal Type (Veg/Jain) */}
            <div className="space-y-1">
              <label className="uppercase tracking-wider">Meal Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['Veg', 'Jain'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t as MealDietType)}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      type === t 
                        ? 'border-[#F59E0B] bg-[#FFF8E7] text-[#F59E0B]' 
                        : 'border-[#E5E7EB] bg-white text-slate-600 hover:bg-stone-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-1">
              <label className="uppercase tracking-wider">Availability Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MealAvailability)}
                className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white cursor-pointer"
              >
                <option value="Available">Available</option>
                <option value="Limited Availability">Limited Availability</option>
                <option value="Unavailable">Unavailable</option>
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
              className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white min-h-[70px] resize-none"
              placeholder="e.g. Traditional full meal with rotis, sabzi, dessert..."
            />
          </div>

          {/* Image Upload (UI only) */}
          <div className="space-y-1">
            <label className="uppercase tracking-wider block">Upload Image (UI Mock)</label>
            <div 
              onClick={handleUploadSimulate}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                imageUploaded 
                  ? 'border-[#16A34A] bg-[#16A34A]/5 text-[#16A34A]' 
                  : 'border-[#E5E7EB] hover:border-[#F59E0B] hover:bg-[#FFF8E7]/30'
              }`}
            >
              {uploadProgress ? (
                <div className="h-5 w-5 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
              ) : imageUploaded ? (
                <>
                  <Check size={18} className="text-[#16A34A]" />
                  <span className="text-[10px] font-bold text-[#16A34A]">IMAGE_MEAL_PREVIEW.JPG (UPLOADED)</span>
                </>
              ) : (
                <>
                  <Upload size={18} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-semibold">Click to select and upload dish preview image</span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
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
              {editMeal ? 'Save Meal' : 'Add Meal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
