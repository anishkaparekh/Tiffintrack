import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { VendorProfile } from '../../../types/profile';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: VendorProfile;
  onSave: (updatedProfile: VendorProfile) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave
}: EditProfileModalProps) {
  // Temporary local states for controlled form inputs
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [ownerName, setOwnerName] = useState(profile.ownerName);
  const [description, setDescription] = useState(profile.description);
  const [experience, setExperience] = useState(profile.experience.toString());
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);

  // Sync inputs with profile props when modal opens, or when profile resets
  useEffect(() => {
    if (isOpen) {
      setBusinessName(profile.businessName);
      setOwnerName(profile.ownerName);
      setDescription(profile.description);
      setExperience(profile.experience.toString());
      setPhone(profile.phone);
      setEmail(profile.email);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!businessName.trim()) {
      alert("Business Name is required.");
      return;
    }
    if (!ownerName.trim()) {
      alert("Owner Name is required.");
      return;
    }
    if (!phone.trim()) {
      alert("Phone Number is required.");
      return;
    }
    if (!email.trim()) {
      alert("Email Address is required.");
      return;
    }
    if (!description.trim()) {
      alert("Business Description is required.");
      return;
    }

    const experienceNum = parseInt(experience, 10);
    if (isNaN(experienceNum) || experienceNum < 0) {
      alert("Years of Experience must be a positive number.");
      return;
    }

    // Pass updated profile data back to parent
    onSave({
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      description: description.trim(),
      experience: experienceNum,
      phone: phone.trim(),
      email: email.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-[#E5E7EB] animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#1F2937]">Update Business Profile</h3>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-[#1F2937] hover:bg-[#F4F9F6] rounded-lg transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-500 max-h-[75vh] overflow-y-auto">
          {/* Business Name */}
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Business Name</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
            />
          </div>

          {/* Owner Name */}
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Owner Name</label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Experience */}
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="uppercase tracking-wider">Years of Experience</label>
              <input
                type="number"
                required
                min="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="uppercase tracking-wider">Primary Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Business Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white min-h-[70px] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F4F9F6] text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs shadow-md shadow-[#00B074]/15 transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
