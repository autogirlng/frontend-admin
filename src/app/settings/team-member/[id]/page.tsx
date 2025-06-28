"use client";
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminProfileCard from "@/components/settings/AdminProfile";
import { useAppSelector } from "@/lib/hooks";
import { Member } from "@/utils/types";

const TeamMemberPage = () => {
  const { member } = useAppSelector((state) => state.teamMember);
  return (
    <DashboardLayout title="Team Member" currentPage="Team Member ">
      <div className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11">
        <AdminProfileCard member={member as Member} />
      </div>
    </DashboardLayout>
  );
};

export default TeamMemberPage;
