// src/app/user/admin/[id]/page.tsx
// This file assumes you are using Next.js App Router for dynamic routes.

"use client"; // This component uses client-side hooks like useParams and custom hooks

import React from "react";
import { useParams } from "next/navigation"; // To get dynamic route parameters in App Router

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminProfileCard from "@/components/settings/AdminProfile";
// No direct import of Member type needed here, as it's handled by useGetUser's return type
// and AdminProfileCard's props.

import useGetUser from "@/components/settings/hook/use_get_user";
import { FullPageSpinner } from "@/components/shared/spinner";
import EmptyState from "@/components/EmptyState";
import { ImageAssets } from "@/utils/ImageAssets";
import BackLink from "@/components/BackLink";
const TeamMemberPage = () => {
  // Get the 'id' parameter from the URL.
  // In App Router, params directly contain the dynamic segments.
  const params = useParams();
  const userId = params.id as string; // Assert as string, as dynamic params are always strings

  // Use the TanStack Query hook to fetch user data
  const { user, isLoading, isError } = useGetUser(userId);

  // --- Loading State ---
  if (isLoading) {
    return (
      <DashboardLayout title="Team Member" currentPage="Team Member ">
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
     <FullPageSpinner/>
        </div>
      </DashboardLayout>
    );
  }

  // --- Error State ---
  if (isError) {
    // The useGetUser hook itself handles showing the toast for the error.
    return (
      <DashboardLayout title="Team Member" currentPage="Team Member ">
        <BackLink backLink=""/>
       <EmptyState title="An Error Occurred" image={ImageAssets.icons.errorState}/>
        
      </DashboardLayout>
    );
  }

  // --- No User Found State ---
  // This case covers when isLoading is false and isError is false, but 'user' is null/undefined.
  // This might happen if the API returns a 200 OK but with no data, or a valid ID doesn't correspond to a user.
  if (!user) {
    return (
      <DashboardLayout title="Team Member" currentPage="Team Member ">
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-gray-500">
          <p className="text-lg">No user found for this ID.</p>
        </div>
      </DashboardLayout>
    );
  }

  // --- Success State: Render AdminProfileCard with user data ---
  return (
    <DashboardLayout title="Team Member" currentPage="Team Member ">
      <div className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11">
        <BackLink backLink=""/>
        <AdminProfileCard member={user} />
      </div>
      {/* ToastContainer is assumed to be in your root layout (e.g., layout.tsx) */}
    </DashboardLayout>
  );
};

export default TeamMemberPage;