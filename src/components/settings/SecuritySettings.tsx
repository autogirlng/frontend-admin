// SecuritySettingsWidget.tsx
import React from "react";

const SecuritySettings = () => {
  return (
    <div className="bg-grey-50 rounded-lg shadow-sm p-8">
      <h2 className="text-xl font-semibold text-grey-900 mb-6">
        Login & Security
      </h2>

      <div className="flex items-center justify-between py-4 border-b border-grey-200 last:border-b-0">
        <div className="text-grey-900 font-medium">Password</div>
        <button className="px-4 py-2 bg-grey-100 text-grey-700 rounded-lg hover:bg-grey-200 focus:outline-none focus:ring-2 focus:ring-grey-300">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
