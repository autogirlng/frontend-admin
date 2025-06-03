// app/auth/new-password/page.tsx
import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import NewPasswordForm from "./NewPasswordForm"; // Import the new client component
import { FullPageSpinner } from "@/components/shared/spinner";

export default function SetNewPasswordPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 text-left">
          Set New Password
        </h2>
        <p className="text-gray-600 text-sm text-left mb-6">
          Enter your new password below.
        </p>

        {/* Wrap the client component that uses useSearchParams in Suspense */}
        <Suspense fallback={<FullPageSpinner />}>
          <NewPasswordForm />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
