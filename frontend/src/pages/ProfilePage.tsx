import React from 'react';
import { useAuthStore } from '../stores/authStore';

const ProfilePage: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">You're not signed in</h2>
          <p className="text-gray-600">Please sign in to view your profile and orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="w-40 h-40 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
              {user?.userprofile?.avatar ? (
                <img src={user.userprofile.avatar} alt={user.username} />
              ) : (
                <span className="text-gray-400">No avatar</span>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <p className="text-lg font-semibold">{user.first_name} {user.last_name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="mt-4">
              <h3 className="font-semibold">Contact</h3>
              <p className="text-gray-600">Phone: {user.userprofile?.phone || 'N/A'}</p>
              <p className="text-gray-600">Address: {user.userprofile?.address || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold">Order History</h3>
          <p className="text-sm text-gray-600">Order history will appear here (coming soon).</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
