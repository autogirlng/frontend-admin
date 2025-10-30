// app/components/FormNavigation.tsx
"use client";
import Button from "@/components/generic/ui/Button";

type FormNavigationProps = {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  prevStep: () => void;
  nextStep: () => void; // We let the parent handle validation
};

export default function FormNavigation({
  currentStep,
  totalSteps,
  isSubmitting,
  prevStep,
  nextStep,
}: FormNavigationProps) {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            {currentStep > 1 && (
              <Button type="button" variant="secondary" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>
          <div>
            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep} className="px-6 py-2.5">
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="px-6 py-2.5"
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
