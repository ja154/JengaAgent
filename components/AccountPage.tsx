
import React, { useState, useEffect } from 'react';
import { type UserProfile, AgentPersonality } from '../types';
import { CloseIcon, UserIcon } from './icons';

interface AccountPageProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (newProfile: UserProfile) => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ isOpen, onClose, userProfile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [avatarPreview, setAvatarPreview] = useState<string>(userProfile.avatarUrl);

  useEffect(() => {
    if (isOpen) {
      setFormData(userProfile);
      setAvatarPreview(userProfile.avatarUrl);
    }
  }, [isOpen, userProfile]);

  useEffect(() => {
    const img = new Image();
    img.src = formData.avatarUrl;
    img.onload = () => setAvatarPreview(formData.avatarUrl);
    img.onerror = () => setAvatarPreview(''); // Reset if URL is invalid
  }, [formData.avatarUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-page-title"
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 id="account-page-title" className="text-lg font-bold text-slate-200">
            My Account
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors" aria-label="Close settings">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-8">
            {/* Profile Section */}
            <section>
                <h3 className="text-base font-semibold text-slate-200 mb-1">Profile</h3>
                <p className="text-sm text-slate-300 mb-4">This information will be displayed publicly.</p>
                 <div className="flex items-center gap-6">
                    <div 
                        className="size-24 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 bg-cover bg-center border-2 border-slate-600 shadow-md"
                        style={avatarPreview ? { backgroundImage: `url("${avatarPreview}")` } : {}}
                    >
                        {!avatarPreview && <UserIcon className="w-12 h-12 text-slate-400" />}
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-700 text-slate-100"
                                placeholder="e.g., Alex Ryder"
                            />
                        </div>
                        <div>
                           <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-300 mb-1.5">Avatar URL</label>
                           <input type="url" id="avatarUrl" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-700 text-slate-100"
                                placeholder="https://example.com/avatar.png"
                            />
                        </div>
                    </div>
                </div>
            </section>
            
            <div className="border-t border-slate-700"></div>

            {/* Preferences Section */}
            <section>
                <h3 className="text-base font-semibold text-slate-200 mb-1">Preferences</h3>
                <p className="text-sm text-slate-300 mb-4">Customize the application to your liking.</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="agentPersonality" className="block text-sm font-medium text-slate-300 mb-1.5">Agent Personality</label>
                        <select id="agentPersonality" name="agentPersonality" value={formData.agentPersonality} onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-700 text-slate-100"
                        >
                            <option value={AgentPersonality.Friendly}>Friendly</option>
                            <option value={AgentPersonality.Formal}>Formal</option>
                            <option value={AgentPersonality.Humorous}>Humorous</option>
                        </select>
                    </div>
                </div>
            </section>

          </div>
          
          <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700 rounded-b-xl flex justify-end items-center gap-3 sticky bottom-0">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-200 bg-slate-700 border border-slate-600 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
