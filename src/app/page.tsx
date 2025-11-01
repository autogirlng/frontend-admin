import DashboardPage from "@/components/dashboard/dashboard/Dashboard";
import DashboardLayout from "./dashboard/layout";

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  );
}
