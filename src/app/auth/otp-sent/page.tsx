// app/auth/otp-sent/page.tsx (or wherever OtpSentPage is located)
import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { FullPageSpinner } from "@/components/shared/spinner";
import OtpForm from "./OtpForm";

export default function OtpSentPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md p-6 text-left">
        {/* Wrap the client component that uses useSearchParams in Suspense */}
        <Suspense fallback={<FullPageSpinner />}>
          <OtpForm />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
