import Link from "next/link";
import { notFound } from "next/navigation";
import { getCabinetDecision } from "@/lib/services/cabinet";
import { SyncBadge } from "@/components/SyncBadge";

export const dynamic = "force-dynamic";

export default async function CabinetDecisionPage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  const decision = await getCabinetDecision(decodeURIComponent(docId));
  if (!decision) notFound();

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual text-muted">ආණ්ඩුව · அமைச்சரவை · Cabinet decision</p>
        <h1>{decision.description}</h1>
        <SyncBadge source="nuuuwan/lk_cabinet_decisions · synced pipeline" />
      </section>

      <div className="card">
        {decision.title && <h3>{decision.title}</h3>}
        <p className="card-meta">
          <span className="badge">{decision.date}</span>
          {decision.lang && <span className="badge">{decision.lang}</span>}
        </p>
        {decision.body_snippet && (
          <div className="doc-body mt-2">
            <p>{decision.body_snippet}</p>
          </div>
        )}
      </div>

      <p className="mt-2">
        <Link href="/cabinet">← Cabinet search</Link>
        {" · "}
        <Link href="/manifesto">Manifesto tracker</Link>
      </p>
    </div>
  );
}
