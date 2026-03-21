import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Upload, Save } from 'lucide-react';
import { mockUser } from '../../data/mockData';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleFileUpload = () => {
    alert('CSV file upload would be implemented here. This would allow users to upload new transaction data.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your personal information, data sources, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              {isEditing && (
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Data Sources */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Data Sources
            </h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Bank Statement CSV</h3>
                    <p className="text-gray-600 text-sm">Last uploaded: January 15, 2025</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Connected</span>
                    <button
                      onClick={handleFileUpload}
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">SMS Transactions</h3>
                    <p className="text-gray-600 text-sm">Automatically parsing transaction SMS</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors text-sm">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleFileUpload}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload New Data Source
              </button>
            </div>
          </div>
        </div>

        {/* Security & Account */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Account Security
            </h2>
            
            <div className="space-y-4">
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Change Password</div>
                <div className="text-gray-600 text-sm">Update your account password</div>
              </button>
              
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                <div className="text-gray-600 text-sm">Add an extra layer of security</div>
              </button>
              
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Login Activity</div>
                <div className="text-gray-600 text-sm">View recent account access</div>
              </button>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Stats</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Created</span>
                <span className="font-medium">March 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data Sources</span>
                <span className="font-medium">2 Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transactions Analyzed</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reports Generated</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
            <h2 className="text-xl font-semibold text-red-900 mb-6">Danger Zone</h2>
            
            <div className="space-y-4">
              <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                <div className="font-medium text-red-900">Export All Data</div>
                <div className="text-red-600 text-sm">Download all your data</div>
              </button>
              
              <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                <div className="font-medium text-red-900">Delete Account</div>
                <div className="text-red-600 text-sm">Permanently delete your account</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;