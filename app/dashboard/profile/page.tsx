'use client';import React, { useState } from 'react';

import { User, Mail, Phone, Shield, Upload, Save } from 'lucide-react';

import React, { useState, useEffect } from 'react';import { mockUser } from '@/data/mockData';

import { useSession } from 'next-auth/react';

import { useRouter } from 'next/navigation';const Profile= () => {

import { User, Mail, Shield, Upload, Save, Loader2 } from 'lucide-react';  const [profileData, setProfileData] = useState({

    name: mockUser.name,

interface ProfileData {    email: mockUser.email,

  id: string;    phone: mockUser.phone,

  name: string | null;  });

  email: string;

  createdAt: string;  const [isEditing, setIsEditing] = useState(false);

}

  const handleSave = () => {

const Profile = () => {    // Here you would typically save to backend

  const { data: session, status } = useSession();    setIsEditing(false);

  const router = useRouter();    alert('Profile updated successfully!');

    };

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const [editedName, setEditedName] = useState('');  const handleFileUpload = () => {

  const [isEditing, setIsEditing] = useState(false);    alert('CSV file upload would be implemented here. This would allow users to upload new transaction data.');

  const [loading, setLoading] = useState(true);  };

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');  return (

  const [success, setSuccess] = useState('');    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="mb-8">

  // Redirect if not authenticated        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>

  useEffect(() => {        <p className="text-gray-600 mt-2">

    if (status === 'unauthenticated') {          Manage your personal information, data sources, and account security.

      router.push('/login');        </p>

    }      </div>

  }, [status, router]);

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

  // Fetch profile data        {/* Profile Information */}

  useEffect(() => {        <div className="lg:col-span-2 space-y-6">

    if (status === 'authenticated') {          <div className="bg-white rounded-xl shadow-lg p-6">

      fetchProfile();            <div className="flex items-center justify-between mb-6">

    }              <h2 className="text-xl font-semibold text-gray-900 flex items-center">

  }, [status]);                <User className="h-5 w-5 mr-2" />

                Personal Information

  const fetchProfile = async () => {              </h2>

    try {              <button

      setLoading(true);                onClick={() => setIsEditing(!isEditing)}

      setError('');                className="text-blue-600 hover:text-blue-800 transition-colors"

                    >

      const response = await fetch('/api/profile');                {isEditing ? 'Cancel' : 'Edit'}

                    </button>

      if (!response.ok) {            </div>

        throw new Error('Failed to fetch profile');            

      }            <div className="space-y-4">

                    <div>

      const data = await response.json();                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>

      setProfileData(data);                <input

      setEditedName(data.name || '');                  type="text"

    } catch (err) {                  value={profileData.name}

      setError('Failed to load profile data');                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}

      console.error('Profile fetch error:', err);                  disabled={!isEditing}

    } finally {                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"

      setLoading(false);                />

    }              </div>

  };              

              <div>

  const handleSave = async () => {                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>

    if (!editedName.trim()) {                <input

      setError('Name cannot be empty');                  type="email"

      return;                  value={profileData.email}

    }                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}

                  disabled={!isEditing}

    try {                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"

      setSaving(true);                />

      setError('');              </div>

      setSuccess('');              

                    <div>

      const response = await fetch('/api/profile', {                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>

        method: 'PUT',                <input

        headers: {                  type="tel"

          'Content-Type': 'application/json',                  value={profileData.phone}

        },                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}

        body: JSON.stringify({ name: editedName }),                  disabled={!isEditing}

      });                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"

                      />

      if (!response.ok) {              </div>

        throw new Error('Failed to update profile');              

      }              {isEditing && (

                      <div className="flex space-x-4 pt-4">

      const updatedData = await response.json();                  <button

      setProfileData(updatedData);                    onClick={handleSave}

      setIsEditing(false);                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"

      setSuccess('Profile updated successfully!');                  >

                          <Save className="h-4 w-4 mr-2" />

      // Clear success message after 3 seconds                    Save Changes

      setTimeout(() => setSuccess(''), 3000);                  </button>

    } catch (err) {                  <button

      setError('Failed to update profile');                    onClick={() => setIsEditing(false)}

      console.error('Profile update error:', err);                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"

    } finally {                  >

      setSaving(false);                    Cancel

    }                  </button>

  };                </div>

              )}

  const handleFileUpload = () => {            </div>

    alert('CSV file upload would be implemented here. This would allow users to upload new transaction data.');          </div>

  };

          {/* Data Sources */}

  if (status === 'loading' || loading) {          <div className="bg-white rounded-xl shadow-lg p-6">

    return (            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">

      <div className="flex items-center justify-center min-h-screen">              <Upload className="h-5 w-5 mr-2" />

        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />              Data Sources

      </div>            </h2>

    );            

  }            <div className="space-y-4">

              <div className="border border-gray-200 rounded-lg p-4">

  if (status === 'unauthenticated') {                <div className="flex items-center justify-between">

    return null; // Will redirect in useEffect                  <div>

  }                    <h3 className="font-semibold text-gray-900">Bank Statement CSV</h3>

                    <p className="text-gray-600 text-sm">Last uploaded: January 15, 2025</p>

  return (                  </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">                  <div className="flex space-x-2">

      <div className="mb-8">                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Connected</span>

        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>                    <button

        <p className="text-gray-600 mt-2">                      onClick={handleFileUpload}

          Manage your personal information, data sources, and account security.                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm"

        </p>                    >

      </div>                      Update

                    </button>

      {/* Success Message */}                  </div>

      {success && (                </div>

        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">              </div>

          {success}              

        </div>              <div className="border border-gray-200 rounded-lg p-4">

      )}                <div className="flex items-center justify-between">

                  <div>

      {/* Error Message */}                    <h3 className="font-semibold text-gray-900">SMS Transactions</h3>

      {error && (                    <p className="text-gray-600 text-sm">Automatically parsing transaction SMS</p>

        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">                  </div>

          {error}                  <div className="flex space-x-2">

        </div>                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>

      )}                    <button className="text-blue-600 hover:text-blue-800 transition-colors text-sm">

                      Configure

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">                    </button>

        {/* Profile Information */}                  </div>

        <div className="lg:col-span-2 space-y-6">                </div>

          <div className="bg-white rounded-xl shadow-lg p-6">              </div>

            <div className="flex items-center justify-between mb-6">              

              <h2 className="text-xl font-semibold text-gray-900 flex items-center">              <button

                <User className="h-5 w-5 mr-2" />                onClick={handleFileUpload}

                Personal Information                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center"

              </h2>              >

              {!isEditing && (                <Upload className="h-5 w-5 mr-2" />

                <button                Upload New Data Source

                  onClick={() => setIsEditing(true)}              </button>

                  className="text-blue-600 hover:text-blue-800 transition-colors"            </div>

                >          </div>

                  Edit        </div>

                </button>

              )}        {/* Security & Account */}

            </div>        <div className="space-y-6">

                      <div className="bg-white rounded-xl shadow-lg p-6">

            <div className="space-y-4">            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">

              {/* Name Field */}              <Shield className="h-5 w-5 mr-2" />

              <div>              Account Security

                <label className="block text-sm font-medium text-gray-700 mb-2">            </h2>

                  <User className="h-4 w-4 inline mr-1" />            

                  Full Name            <div className="space-y-4">

                </label>              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">

                <input                <div className="font-medium text-gray-900">Change Password</div>

                  type="text"                <div className="text-gray-600 text-sm">Update your account password</div>

                  value={isEditing ? editedName : profileData?.name || 'Not set'}              </button>

                  onChange={(e) => setEditedName(e.target.value)}              

                  disabled={!isEditing}              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">

                  className={`w-full px-4 py-2 border rounded-lg ${                <div className="font-medium text-gray-900">Two-Factor Authentication</div>

                    isEditing                <div className="text-gray-600 text-sm">Add an extra layer of security</div>

                      ? 'border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'              </button>

                      : 'border-gray-300 bg-gray-50'              

                  }`}              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">

                />                <div className="font-medium text-gray-900">Login Activity</div>

              </div>                <div className="text-gray-600 text-sm">View recent account access</div>

              </button>

              {/* Email Field (Read-only) */}            </div>

              <div>          </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">

                  <Mail className="h-4 w-4 inline mr-1" />          {/* Account Stats */}

                  Email Address          <div className="bg-white rounded-xl shadow-lg p-6">

                </label>            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Stats</h2>

                <input            

                  type="email"            <div className="space-y-4">

                  value={profileData?.email || ''}              <div className="flex justify-between">

                  disabled                <span className="text-gray-600">Account Created</span>

                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"                <span className="font-medium">March 2024</span>

                />              </div>

                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>              <div className="flex justify-between">

              </div>                <span className="text-gray-600">Data Sources</span>

                <span className="font-medium">2 Connected</span>

              {/* Account Created */}              </div>

              <div>              <div className="flex justify-between">

                <label className="block text-sm font-medium text-gray-700 mb-2">                <span className="text-gray-600">Transactions Analyzed</span>

                  Account Created                <span className="font-medium">1,247</span>

                </label>              </div>

                <p className="text-gray-600">              <div className="flex justify-between">

                  {profileData?.createdAt                <span className="text-gray-600">Reports Generated</span>

                    ? new Date(profileData.createdAt).toLocaleDateString('en-US', {                <span className="font-medium">12</span>

                        year: 'numeric',              </div>

                        month: 'long',            </div>

                        day: 'numeric',          </div>

                      })

                    : 'N/A'}          {/* Danger Zone */}

                </p>          <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">

              </div>            <h2 className="text-xl font-semibold text-red-900 mb-6">Danger Zone</h2>

            

              {/* Save/Cancel Buttons */}            <div className="space-y-4">

              {isEditing && (              <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">

                <div className="flex gap-3 pt-4">                <div className="font-medium text-red-900">Export All Data</div>

                  <button                <div className="text-red-600 text-sm">Download all your data</div>

                    onClick={handleSave}              </button>

                    disabled={saving}              

                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"              <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">

                  >                <div className="font-medium text-red-900">Delete Account</div>

                    {saving ? (                <div className="text-red-600 text-sm">Permanently delete your account</div>

                      <>              </button>

                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />            </div>

                        Saving...          </div>

                      </>        </div>

                    ) : (      </div>

                      <>    </div>

                        <Save className="h-4 w-4 mr-2" />  );

                        Save Changes};

                      </>

                    )}

                  </button>export default Profile;

                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(profileData?.name || '');
                      setError('');
                    }}
                    disabled={saving}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload CSV Bank Statement</p>
                <button
                  onClick={handleFileUpload}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Choose File
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">SMS Transaction Data</h3>
                <p className="text-sm text-blue-700">
                  Enable SMS permissions on your mobile device to automatically track UPI and bank transactions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Password</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Change Password
                </button>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Add an extra layer of security to your account
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Data Sharing</h3>
                  <p className="text-xs text-gray-600">Control who can see your credit score</p>
                </div>
                <button className="bg-gray-300 rounded-full w-12 h-6 flex items-center px-1 transition-colors">
                  <div className="bg-white w-4 h-4 rounded-full"></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Analytics</h3>
                  <p className="text-xs text-gray-600">Help us improve our services</p>
                </div>
                <button className="bg-blue-600 rounded-full w-12 h-6 flex items-center justify-end px-1 transition-colors">
                  <div className="bg-white w-4 h-4 rounded-full"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
