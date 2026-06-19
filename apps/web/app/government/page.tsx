import { getFederationOverview } from "@/lib/services/platform";
import GovernmentPageClient from "@/components/GovernmentPageClient";

export const dynamic = "force-dynamic";

export default function GovernmentPage() {
  const data = getFederationOverview();
  return <GovernmentPageClient sources={data.sources} />;
}
