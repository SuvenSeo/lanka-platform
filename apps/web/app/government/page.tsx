import { getFederation } from "@/lib/api";
import GovernmentPageClient from "@/components/GovernmentPageClient";

export const dynamic = "force-dynamic";

export default async function GovernmentPage() {
  const data = await getFederation().catch(() => null);
  const sources = (data?.sources as Array<Record<string, unknown>>) ?? [];

  return <GovernmentPageClient sources={sources} />;
}
