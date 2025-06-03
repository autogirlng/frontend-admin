// Settings.tsx
import React, { useState } from "react";
import ProfileSettings from "./ProfileSettings"; // Ensure this path is correct
import Team from "../tables/Team";
import SecuritySettings from "./SecuritySettings";

const ManageRolesSettingsWidget = () => (
  <div className="bg-white rounded-lg shadow-sm p-8 min-h-[200px] flex items-center justify-center text-grey-500">
    Manage Roles Settings Content
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Profile"); // State to manage the active tab

  // Function to render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return <ProfileSettings />;
      case "Team":
        return <Team />;
      case "Security":
        return <SecuritySettings />;
      case "Manage Roles":
        return <ManageRolesSettingsWidget />;
      default:
        return <ProfileSettings />; // Fallback
    }
  };

  return (
    <div className="min-h-screen font-inter">
      {/* Navigation Tabs */}
      <nav className="mb-8">
        <ul className="flex space-x-8 md:space-x-32 border-b border-t pt-6 border-grey-200">
          {["Profile", "Team", "Security", "Manage Roles"].map((tab) => (
            <li
              key={tab}
              className={`pb-3 cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-primary-500 text-primary-500 font-medium"
                  : "text-grey-500 hover:text-grey-700"
              }`}
              onClick={() => setActiveTab(tab)} // Update active tab on click
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>

      {/* Dynamic Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default Settings;
