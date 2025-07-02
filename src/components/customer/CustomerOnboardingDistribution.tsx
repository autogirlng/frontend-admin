import React, { FC } from "react";
import Icons from "@/utils/Icon";
import { Spinner } from "@/components/shared/spinner";

interface CustomerOnboardingDistributionProps {
  selfOnboardedCustomers: number;
  adminOnboardedCustomers: number;
  isLoading?: boolean;
}

const CustomerOnboardingDistribution: FC<CustomerOnboardingDistributionProps> = ({
  adminOnboardedCustomers,
  selfOnboardedCustomers,
  isLoading = false,
}) => {
  const safeSelfOnboarded = isLoading ? 0 : selfOnboardedCustomers;
  const safeAdminOnboarded = isLoading ? 0 : adminOnboardedCustomers;
  const totalOnboarded: number = safeSelfOnboarded + safeAdminOnboarded;

  const selfOnboardedPercentage: number =
    totalOnboarded === 0 ? 0 : (safeSelfOnboarded / totalOnboarded) * 100;
  const adminOnboardedPercentage: number =
    totalOnboarded === 0 ? 0 : (safeAdminOnboarded / totalOnboarded) * 100;

  const selfOnboardedDegrees: number = (selfOnboardedPercentage / 100) * 360;
  const adminOnboardedDegrees: number = (adminOnboardedPercentage / 100) * 360;

  const pieChartRadius = 80;
  const labelPlacementRadius = pieChartRadius * 0.6;

  const calculateLabelPosition = (startAngle: number, endAngle: number) => {
    const midAngleCss = (startAngle + endAngle) / 2;
    const midAngleTrig = (midAngleCss + 270) % 360;
    const midAngleRadians = (midAngleTrig * Math.PI) / 180;
    const x = labelPlacementRadius * Math.cos(midAngleRadians);
    const y = labelPlacementRadius * Math.sin(midAngleRadians);
    return {
      left: `${((x + pieChartRadius) / (pieChartRadius * 2)) * 100}%`,
      top: `${((y + pieChartRadius) / (pieChartRadius * 2)) * 100}%`,
    };
  };

  const selfOnboardedLabelPos = calculateLabelPosition(0, selfOnboardedDegrees);
  const adminOnboardedLabelPos = calculateLabelPosition(
    selfOnboardedDegrees,
    selfOnboardedDegrees + adminOnboardedDegrees
  );

  return (
    <div className="bg-white border shadow-md shadow-white border-grey-200 mt-1 max-w-2xl space-y-4 rounded-3xl px-3 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-4 py-2 rounded-xl text-sm font-medium text-[#1E93FF]">
          {Icons.ic_ticket}
          <span className="text-grey-900">Onboarding Distribution</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(
                    #1e78fe 0deg ${selfOnboardedDegrees}deg,
                    #FFA000 ${selfOnboardedDegrees}deg ${
                    selfOnboardedDegrees + adminOnboardedDegrees
                  }deg
                  )`,
                }}
              ></div>
              <div
                className="absolute text-sm font-bold text-white transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: selfOnboardedLabelPos.left,
                  top: selfOnboardedLabelPos.top,
                }}
              >
                {selfOnboardedPercentage > 0 &&
                  `${Math.round(selfOnboardedPercentage)}%`}
              </div>
              <div
                className="absolute text-sm font-bold text-white transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: adminOnboardedLabelPos.left,
                  top: adminOnboardedLabelPos.top,
                }}
              >
                {adminOnboardedPercentage > 0 &&
                  `${Math.round(adminOnboardedPercentage)}%`}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#0673FF] mr-3"></span>
          <span className="text-grey-700 text-base mr-8">Self Onboarded Customers</span>
          <span className="font-semibold text-grey-900 text-base">
            {isLoading ? "-" : selfOnboardedCustomers.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#F3A218] mr-3"></span>
          <span className="text-grey-700 text-base mr-8">Admin Onboarded Customers</span>
          <span className="font-semibold text-grey-900 text-base">
            {isLoading ? "-" : adminOnboardedCustomers.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerOnboardingDistribution; 