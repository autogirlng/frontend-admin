"use client";

import React from "react";
import { SettingsCard } from "./SettingsCard";
import {
  User,
  Users,
  SlidersHorizontal,
  Briefcase,
  ShipWheel,
  Bell,
  Activity,
  Hammer,
  Ticket,
  Puzzle,
  Star,
  ShieldEllipsis,
  Pencil
} from "lucide-react";
import CustomBack from "@/components/generic/CustomBack";

export default function SettingsPage() {
  return (
    <>
      <CustomBack />
      <main className="py-2 max-w-8xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-lg text-gray-600 mt-1">
            Manage your account and platform settings.
          </p>
        </div>

        {/* --- Settings Card Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Me (Profile) */}
          <SettingsCard
            href="/dashboard/profile"
            icon={User}
            title="My Profile"
            description="Update your personal details, email, and password."
            iconBgColor="bg-blue-100"
          />

          {/* 2. Autogirl Staffs */}
          <SettingsCard
            href="/dashboard/settings/staffs"
            icon={Users}
            title="Staff Management"
            description="Add, remove, or manage roles for your staff members."
            iconBgColor="bg-green-100"
          />

          {/* 3. Configurations */}
          <SettingsCard
            href="/dashboard/set-up"
            icon={SlidersHorizontal}
            title="Configurations"
            description="Manage global platform settings like booking types and features."
            iconBgColor="bg-purple-100"
          />

          {/* 4. Auto girl Affairs */}
          <SettingsCard
            href="/dashboard/autogirl"
            icon={Briefcase}
            title="Autogirl Affairs"
            description="View and update your company's profile and legal documents."
            iconBgColor="bg-sky-100"
          />

          {/* 5. Audit Trail */}
          <SettingsCard
            href="/dashboard/settings/audit-trails"
            icon={Activity}
            title="Audit Trail"
            description="View activities on the platform."
            iconBgColor="bg-yellow-100"
          />

          {/* 6. Notifications */}
          <SettingsCard
            href="/dashboard/notifications"
            icon={Bell}
            title="Notification Settings"
            description="View all notifications."
            iconBgColor="bg-red-100"
          />

          {/* 6. Roles and Permissions */}
          <SettingsCard
            href="/dashboard/settings/role"
            icon={Hammer}
            title="Role Settings"
            description="Manage user roles and permissions."
            iconBgColor="bg-green-100"
          />

          {/* 7. Past Bookings */}
          <SettingsCard
            href="/dashboard/bookings/past-bookings"
            icon={Ticket}
            title="Create Past Bookings"
            description="Create past bookings which are historical bookings made before the platform was created."
            iconBgColor="bg-blue-100"
          />

          {/* 7. Coupons */}
          <SettingsCard
            href="/dashboard/coupons"
            icon={Puzzle}
            title="Coupons"
            description="Manage discount coupons for your platform."
            iconBgColor="bg-yellow-300"
          />

          {/* 8. Driver Applicant */}
          <SettingsCard
            href="/dashboard/drivers/applications"
            icon={ShipWheel}
            title="Driver Application from Host"
            description="Manage Driver Application"
            iconBgColor="bg-pink-300"
          />

          {/* 9. Rating and Review */}
          <SettingsCard
            href="/dashboard/reviews"
            icon={Star}
            title="Rating & Reviews"
            description="Manage Rating and Reviews"
            iconBgColor="bg-green-300"
          />

          {/* 10. Special Sale Booking */}
          <SettingsCard
            href="/dashboard/set-up/special-sale-booking"
            icon={ShieldEllipsis}
            title="Special Sale Booking"
            description="Manage special sale bookings."
            iconBgColor="bg-red-300"
          />

          {/* 11. Customer Banner Settings */}
          <SettingsCard
            href="/dashboard/announcement-banner"
            icon={Pencil}
            title="Customer Banner"
            description="Set top banner on customer homepage."
            iconBgColor="bg-gray-100"
          />
        </div>
      </main>
    </>
  );
}
