import { Suspense } from "react";
import State from "@/components/outskirt/State";
import CustomLoader from "@/components/generic/CustomLoader";

export default function StatePage() {
  return (
    <Suspense fallback={<CustomLoader />}>
      <State />
    </Suspense>
  );
}
