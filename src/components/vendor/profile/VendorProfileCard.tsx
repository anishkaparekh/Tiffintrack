import React from 'react';
import { ChefHat, Camera, Edit2 } from 'lucide-react';
import { VendorProfile } from '../../../types/profile';

interface VendorProfileCardProps {
  profile: VendorProfile;
  onEditClick: () => void;
  onChangePhotoClick: () => void;
}

export default function VendorProfileCard({
  profile,
  onEditClick,
  onChangePhotoClick
}: VendorProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Cover Banner Template */}
      <div className="h-32 bg-[#00B074]/10 relative flex items-center justify-center border-b border-[#E5E7EB]">
        <ChefHat className="text-[#00B074]/20 stroke-[1.5]" size={72} />
        
        {/* Cover Photo Toggler */}
        <button 
          onClick={onChangePhotoClick}
          className="absolute bottom-3 right-4 px-2.5 py-1.5 bg-white/95 border border-[#E5E7EB] hover:bg-slate-55 rounded-xl text-[10px] font-black text-slate-600 hover:text-[#00B074] shadow-sm transition-all flex items-center space-x-1 cursor-pointer"
        >
          <Camera size={12} />
          <span>Cover Photo</span>
        </button>
      </div>

      {/* Profile Details */}
      <div className="px-6 pb-6 pt-16 relative space-y-4">
        {/* Owner Photo Avatar Positioning */}
        <div className="absolute -top-12 left-6 w-20 h-20 rounded-2xl bg-white border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
          <div className="w-full h-full bg-[#00B074] text-white flex items-center justify-center text-2xl font-black select-none">
            {profile.ownerName.split(' ').map(n => n[0]).join('')}
          </div>
          
          {/* Avatar Camera trigger */}
          <button 
            onClick={onChangePhotoClick}
            className="absolute inset-0 bg-black/40 text-white opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          >
            <Camera size={16} />
          </button>
        </div>

        {/* Business details */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#1F2937] leading-none">{profile.businessName}</h2>
            <button
              onClick={onEditClick}
              className="p-1 text-slate-400 hover:text-[#00B074] hover:bg-[#F4F9F6] rounded-lg transition-all cursor-pointer"
              title="Edit Profile"
            >
              <Edit2 size={14} />
            </button>
          </div>
          <p className="text-xs text-[#00B074] font-extrabold flex items-center">
            <span>Owner: {profile.ownerName}</span>
            <span className="mx-2 text-slate-300">•</span>
            <span>{profile.experience} Years Experience</span>
          </p>
        </div>

        {/* Business Description */}
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          {profile.description}
        </p>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onEditClick}
            className="flex-1 py-2.5 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs shadow-md shadow-[#00B074]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
          >
            Edit Profile
          </button>
          
          <button
            onClick={onChangePhotoClick}
            className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F4F9F6] text-xs font-bold text-slate-600 hover:text-[#00B074] transition-all cursor-pointer text-center"
          >
            Change Photo
          </button>
        </div>
      </div>
    </div>
  );
}
