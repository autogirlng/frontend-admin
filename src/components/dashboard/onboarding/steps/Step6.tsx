// app/components/steps/Step6.tsx
"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/generic/ui/Button";
import { useVehicleStep6 } from "@/lib/hooks/onboarding/steps/useVehicleStep6";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import CustomLoader from "@/components/generic/CustomLoader";

// --- Helper Components for Display ---
const SummarySection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
    <div className="bg-gray-50 p-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const SummaryItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      {value || <span className="text-gray-400">Not set</span>}
    </dd>
  </div>
);

// --- Child Form Component ---
function VehicleReviewForm({ vehicleId }: { vehicleId: string }) {
  const { vehicleData, isLoading, isSubmitting, vehicleError, handleSubmit } =
    useVehicleStep6(vehicleId);

  if (isLoading) {
    return <CustomLoader />;
  }

  if (vehicleError) {
    toast.error(vehicleError.message);
    return (
      <div className="text-red-500 text-center p-8">
        Error: {vehicleError.message}
      </div>
    );
  }

  if (!vehicleData) {
    return <div className="text-center p-8">Could not load vehicle data.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="">
        <fieldset disabled={isSubmitting}>
          {/* --- Step 1 & 2 Summary --- */}
          <SummarySection title="Vehicle Details">
            <dl className="divide-y divide-gray-200">
              <SummaryItem label="Vehicle Name" value={vehicleData.name} />
              <SummaryItem label="Year" value={vehicleData.yearOfRelease} />
              <SummaryItem
                label="License Plate"
                value={vehicleData.licensePlateNumber}
              />
              <SummaryItem
                label="State of Registration"
                value={vehicleData.stateOfRegistration}
              />
              <SummaryItem label="Seats" value={vehicleData.numberOfSeats} />
              <SummaryItem label="Location" value={vehicleData.address} />
              <SummaryItem
                label="Description"
                value={
                  <p className="whitespace-pre-wrap">
                    {vehicleData.description}
                  </p>
                }
              />
              <SummaryItem
                label="Features"
                value={
                  <ul className="list-disc list-inside">
                    {vehicleData.features?.map((f) => (
                      <li key={f.id}>{f.name}</li>
                    ))}
                  </ul>
                }
              />
            </dl>
          </SummarySection>

          {/* --- Step 3 Summary --- */}
          <SummarySection title="Photos">
            <div className="grid grid-cols-3 gap-4">
              {vehicleData.photos?.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded overflow-hidden"
                >
                  <img
                    src={photo.cloudinaryUrl}
                    alt="Vehicle"
                    className="object-cover w-full h-full"
                  />
                  {photo.isPrimary && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">
                      PRIMARY
                    </span>
                  )}
                </div>
              ))}
            </div>
          </SummarySection>

          {/* --- Step 4 Summary --- */}
          <SummarySection title="Documents">
            <ul className="list-disc list-inside">
              {vehicleData.documents?.map((doc, index) => (
                <li
                  key={index}
                  className="capitalize text-green-700 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {doc.documentType.replace(/_/g, " ").toLowerCase()}
                </li>
              ))}
            </ul>
          </SummarySection>

          {/* --- Step 5 Summary --- */}
          <SummarySection title="Configuration & Pricing">
            <dl className="divide-y divide-gray-200">
              <SummaryItem
                label="Provide Driver?"
                value={vehicleData.willProvideDriver ? "Yes" : "No"}
              />
              <SummaryItem
                label="Provide Fuel?"
                value={vehicleData.willProvideFuel ? "Yes" : "No"}
              />
              <SummaryItem
                label="Extra Hourly Rate"
                value={`NGN ${vehicleData.extraHourlyRate || 0}`}
              />
              <SummaryItem
                label="Outskirt Fee"
                value={`NGN ${vehicleData.outskirtFee || 0}`}
              />
              <SummaryItem
                label="Extreme Fee"
                value={`NGN ${vehicleData.extremeFee || 0}`}
              />
              <SummaryItem
                label="Pricing"
                value={
                  <ul className="list-disc list-inside">
                    {vehicleData.pricing?.map((p) => (
                      <li key={p.bookingTypeId}>
                        {`NGN ${p.price}`} (ID: {p.bookingTypeId})
                      </li>
                    ))}
                  </ul>
                }
              />
              <SummaryItem
                label="Discounts"
                value={
                  <ul className="list-disc list-inside">
                    {vehicleData.discounts?.map((d) => (
                      <li key={d.discountDurationId}>
                        {`${d.percentage}% off`} (ID: {d.discountDurationId})
                      </li>
                    ))}
                  </ul>
                }
              />
            </dl>
          </SummarySection>

          <div className="md:col-span-2 flex justify-between gap-4 pt-4">
            <Link
              href={`/dashboard/onboarding/pricing?id=${vehicleId}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-[#0096FF] text-sm font-medium shadow-sm text-white bg-[#0096FF] hover:bg-[#007ACC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Pricing
            </Link>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </fieldset>
      </div>
    </form>
  );
}

// --- Main Page Component ---
function Step6Content() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("id");

  if (!vehicleId) {
    return (
      <div className="text-red-500 text-center p-8">
        Error: No vehicle ID found in the URL.
      </div>
    );
  }

  return <VehicleReviewForm vehicleId={vehicleId} />;
}

export default function Step6() {
  return (
    <div className="relative min-h-screen pb-24 bg-white">
      <main className="max-w-8xl mt-8">
        <Suspense fallback={<CustomLoader />}>
          <Step6Content />
        </Suspense>
      </main>
    </div>
  );
}
