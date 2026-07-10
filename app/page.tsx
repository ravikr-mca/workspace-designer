import { Suspense } from "react";
import Designer from "@/components/designer/Designer";

export default function Home() {
  return (
    <Suspense>
      <Designer />
    </Suspense>
  );
}
