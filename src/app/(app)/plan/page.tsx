import { Suspense } from "react";
import { PlanClient } from "./PlanClient";

export default function PlanPage() {
  // PlanClient reads ?day= via useSearchParams (deep-link from the Today week
  // strip), which Next requires to sit inside a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <PlanClient />
    </Suspense>
  );
}
