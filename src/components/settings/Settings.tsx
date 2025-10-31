"use client";

import React from "react";
import { SettingsCard } from "./SettingsCard";
import {
  User,
  Users,
  SlidersHorizontal,
  Briefcase,
  CreditCard,
  Bell,
} from "lucide-react";
import CustomBack from "@/components/generic/CustomBack";

export default function SettingsPage() {
  return (
    <>
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
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

          {/* 5. Billing (Suggested) */}
          <SettingsCard
            href="/dashboard/settings/billing"
            icon={CreditCard}
            title="Billing & Payments"
            description="Manage payment methods, view invoices, and subscription details."
            iconBgColor="bg-yellow-100"
          />

          {/* 6. Notifications (Suggested) */}
          <SettingsCard
            href="/dashboard/notifications"
            icon={Bell}
            title="Notification Settings"
            description="View all notifications."
            iconBgColor="bg-red-100"
          />
        </div>
      </main>
    </>
  );
}
