import Link from "next/link";

const RTI_RESOURCES = [
  {
    title: "Right to Information Act No. 12 of 2016",
    desc: "Primary legislation establishing citizens' right to access public information.",
    href: "/legal",
  },
  {
    title: "RTI Commission guidance",
    desc: "How to file requests, appeals, and understand response timelines.",
    href: "/government",
  },
  {
    title: "Request government datasets",
    desc: "Search official open data already federated in Lanka Platform.",
    href: "/government",
  },
  {
    title: "Cabinet decisions (searchable)",
    desc: "Search 1,000+ recent cabinet decisions indexed in-platform.",
    href: "/cabinet",
  },
  {
    title: "Legal corpora",
    desc: "Acts, gazettes, court judgments — searchable via integrated RAG.",
    href: "/legal",
  },
  {
    title: "Dataset catalog",
    desc: "Browse 379+ datasets with live sync from nuuuwan pipelines.",
    href: "/datasets",
  },
];

export default function RtiPage() {
  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">තොරතුරු අයිතිය · தகவல் உரிமை · Right to Information</p>
        <h1>RTI Resource Hub</h1>
        <p className="text-muted">
          In-platform tools for exercising your right to information — search government data,
          cabinet decisions, and legal corpora without leaving Lanka Platform.
        </p>
      </section>

      <div className="dataset-list">
        {RTI_RESOURCES.map((r) => (
          <Link key={r.title} href={r.href} className="card">
            <h3>{r.title}</h3>
            <p className="card-desc">{r.desc}</p>
          </Link>
        ))}
      </div>

      <p className="mt-2 text-muted">
        <Link href="/government">Government federation</Link>
      </p>
    </div>
  );
}
