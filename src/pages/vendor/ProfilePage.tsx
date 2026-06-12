import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import VendorProfileCard from '../../components/vendor/profile/VendorProfileCard';
import ProfileCompletionCard from '../../components/vendor/profile/ProfileCompletionCard';
import KitchenInfoCard from '../../components/vendor/profile/KitchenInfoCard';
import ContactInfoCard from '../../components/vendor/profile/ContactInfoCard';
import DeliverySettingsCard from '../../components/vendor/profile/DeliverySettingsCard';
import OperatingHoursCard from '../../components/vendor/profile/OperatingHoursCard';
import NotificationSettingsCard from '../../components/vendor/profile/NotificationSettingsCard';
import BusinessInsightsCard from '../../components/vendor/profile/BusinessInsightsCard';
import AccountSettingsCard from '../../components/vendor/profile/AccountSettingsCard';
import SupportCard from '../../components/vendor/profile/SupportCard';
import EditProfileModal from '../../components/vendor/profile/EditProfileModal';
import EmptyState from '../../components/vendor/profile/EmptyState';
import SkeletonLoader from '../../components/vendor/profile/SkeletonLoader';

import { 
  mockVendorProfile, 
  mockKitchenDetails, 
  mockContactDetails, 
  mockDeliveryDetails, 
  mockOperatingHours, 
  mockNotificationToggles, 
  mockInsightsSnapshot,
  mockSupportLinks 
} from '../../data/profileMockData';

import { Sparkles, CheckCircle } from 'lucide-react';
import { VendorProfile, KitchenDetails, DeliveryDetails, OperatingHours } from '../../types/profile';
import { signOutVendor } from '../../auth/session';

export default function ProfilePage() {
  const navigate = useNavigate();

  // Unified Profile state owned at page level
  const [profile, setProfile] = useState<VendorProfile>({
    businessName: '',
    ownerName: '',
    description: '',
    experience: 0,
    phone: '',
    email: ''
  });

  // Other configurations state for future editing patterns
  const [kitchen, setKitchen] = useState<KitchenDetails>(mockKitchenDetails);
  const [delivery, setDelivery] = useState<DeliveryDetails>(mockDeliveryDetails);
  const [hours, setHours] = useState<OperatingHours>(mockOperatingHours);

  React.useEffect(() => {
    const userStr = localStorage.getItem('tiffintrack_vendor_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setProfile({
          ownerName: u.name || 'Vendor Owner',
          email: u.email || '',
          phone: u.phone || '+91 99999 99999',
          businessName: u.businessName || u.name || 'Vendor Kitchen',
          description: u.description || 'Homestyle cooked meals.',
          experience: 5
        });
        setKitchen(prev => ({
          ...prev,
          address: u.kitchenAddress || prev.address
        }));
      } catch (e) {
        console.error("Failed to parse tiffintrack_vendor_user in ProfilePage:", e);
      }
    }
  }, []);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reviewer sandboxes
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Save changes handler - updates unified state and closes modal
  const handleSaveProfile = (updatedProfile: VendorProfile) => {
    setProfile(updatedProfile);
    showToast("Profile updated successfully.", "success");
    setIsModalOpen(false);
  };

  // Cancel edits handler
  const handleCancelEdits = () => {
    setIsModalOpen(false);
    showToast("Profile changes discarded.", "info");
  };

  const handleLogout = () => {
    console.log('[ProfilePage] Logging out vendor and redirecting to /vendor/login');
    signOutVendor();
    showToast("Session terminated. Redirecting to login...", "info");
    setTimeout(() => navigate('/vendor/login'), 1500);
  };

  const handlePasswordChange = () => {
    showToast("Simulation: Password reset email dispatched to owner.", "success");
  };

  const handleSupportLinkClick = (title: string) => {
    showToast(`Simulation: Loading document / link for "${title}"...`, "info");
  };

  const handleKitchenEdit = () => {
    showToast("Kitchen configurations form is active. Update details in settings modal.", "info");
  };

  const handleTimingsUpdate = () => {
    showToast("Weekly operating hours schedule updated.", "success");
  };

  const handleManageAreas = () => {
    showToast("Areas settings active: You can add new tag-chips for deliveries.", "info");
  };

  return (
    <DashboardLayout activeTab="profile" onTabSelect={() => {}}>
      {/* Sandbox Toggle bar */}
      <div className="mb-6 p-4 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md text-white border border-slate-800">
        <div className="space-y-1">
          <p className="text-[#FFD200] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#FFD200]" />
            <span>Operational Sandbox Toggles</span>
          </p>
          <h3 className="font-bold text-xs text-slate-100">Simulate states for review</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Use these switches to instantly test loading placeholders and empty states across settings.
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

      {/* Page Content */}
      <div className="space-y-6">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-black text-[#1F2937]">Profile Settings</h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Manage your business details, kitchen information, delivery preferences, and account settings.
          </p>
        </div>

        {isEmpty ? (
          <div className="space-y-6">
            <EmptyState type="missing_info" onActionClick={() => setIsModalOpen(true)} />
            <EmptyState type="no_delivery_areas" onActionClick={handleManageAreas} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Side: Profile, Kitchen details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Card */}
              {isLoading ? (
                <SkeletonLoader type="profile" />
              ) : (
                <VendorProfileCard 
                  profile={profile}
                  onEditClick={() => setIsModalOpen(true)}
                  onChangePhotoClick={() => showToast("Real photo uploads are simulated. Action complete.", "info")}
                />
              )}

              {/* Kitchen Information & Contact Info side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Kitchen details */}
                {isLoading ? (
                  <SkeletonLoader type="profile" />
                ) : (
                  <KitchenInfoCard 
                    details={kitchen}
                    onEditClick={handleKitchenEdit}
                  />
                )}

                {/* Contact info */}
                {isLoading ? (
                  <SkeletonLoader type="profile" />
                ) : (
                  <ContactInfoCard 
                    contacts={{
                      phone: profile.phone,
                      email: profile.email,
                      alternatePhone: mockContactDetails.alternatePhone
                    }}
                    onUpdateClick={() => setIsModalOpen(true)}
                  />
                )}

              </div>

              {/* Delivery parameters and Operating schedules side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* DeliverySettings */}
                {isLoading ? (
                  <SkeletonLoader type="delivery" />
                ) : (
                  <DeliverySettingsCard 
                    details={delivery}
                    onEditClick={() => showToast("Edit delivery configurations active.", "info")}
                    onManageAreasClick={handleManageAreas}
                  />
                )}

                {/* Operating hours */}
                {isLoading ? (
                  <SkeletonLoader type="hours" />
                ) : (
                  <OperatingHoursCard 
                    hours={hours}
                    onUpdateClick={handleTimingsUpdate}
                  />
                )}

              </div>

              {/* Help & Support Navigational Cards */}
              {!isLoading && (
                <SupportCard 
                  links={mockSupportLinks}
                  onLinkClick={handleSupportLinkClick}
                />
              )}

            </div>

            {/* Right Side: Checklist, Toggles, Insights */}
            <div className="space-y-6 lg:sticky lg:top-24">
              
              {/* Completion Progress Check */}
              {!isLoading && (
                <ProfileCompletionCard completionPercentage={85} />
              )}

              {/* Business InsightsSnapshot */}
              {isLoading ? (
                <SkeletonLoader type="insights" />
              ) : (
                <BusinessInsightsCard {...mockInsightsSnapshot} />
              )}

              {/* Notification preferences switches */}
              {isLoading ? (
                <SkeletonLoader type="notifications" />
              ) : (
                <NotificationSettingsCard 
                  initialToggles={mockNotificationToggles}
                  onToggleChange={() => showToast("Notification configurations updated.", "success")}
                />
              )}

              {/* Credentials Change, Two-Factor */}
              {!isLoading && (
                <AccountSettingsCard 
                  onLogoutClick={handleLogout}
                  onPasswordChangeClick={handlePasswordChange}
                />
              )}

            </div>

          </div>
        )}

      </div>

      {/* Edit Profile Modal Dialog */}
      <EditProfileModal 
        isOpen={isModalOpen}
        onClose={handleCancelEdits}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp bg-[#1F2937] text-white px-5 py-3.5 rounded-2xl border border-slate-700 shadow-2xl flex items-center space-x-3 max-w-sm">
          <div className="p-1.5 rounded-lg bg-[#00B074]/20 text-[#00B074]">
            <CheckCircle size={16} />
          </div>
          <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
        </div>
      )}
    </DashboardLayout>
  );
}
