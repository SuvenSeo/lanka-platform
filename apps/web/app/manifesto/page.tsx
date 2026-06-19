import { getManifestoOverview } from "@/lib/services/manifesto";
import ManifestoPageClient from "@/components/ManifestoPageClient";

export default function ManifestoPage() {
  const data = getManifestoOverview();
  return <ManifestoPageClient themes={data.themes} />;
}
