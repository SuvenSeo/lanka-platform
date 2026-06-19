import Link from "next/link";
import { TRILINGUAL } from "@/lib/i18n";

const RTI_RESOURCES = [
  {
    title: "Right to Information Act No. 12 of 2016",
    desc: "Primary legislation establishing citizens' right to access public information.",
    url: "https://www.rticommission.lk/web/index.php?option=com_content&view=article&id=12&Itemid=155&lang=en",
  },
  {
    title: "RTI Commission of Sri Lanka",
    desc: "File appeals, view decisions, and access guidance for information officers.",
    url: "https://www.rticommission.lk/",
  },
  {
    title: "How to file an RTI request",
    desc: "Step-by-step guide — identify the public authority, submit written request, 14-day response window.",
    url: "https://www.rticommission.lk/web/index.php?option=com_content&view=article&id=14&Itemid=157&lang=en",
  },
  {
    title: "data.gov.lk — Request a dataset",
    desc: "Ask ICTA to publish government datasets on the national open data portal.",
    url: "https://www.data.gov.lk/en/request-dataset",
  },
  {
    title: "Cabinet decisions (searchable)",
    desc: "Search 1,000+ recent cabinet decisions indexed by Lanka Platform.",
    url: "/cabinet",
  },
  {
    title: "Legal corpora",
    desc: "Acts, gazettes, court judgments — searchable via nuuuwan pipelines.",
    url: "/legal",
  },
];

export default function RtiPage() {
  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">තොරතුරු අයිතිය · தகவல் உரிமை · Right to Information</p>
        <h1>RTI Resource Hub</h1>
        <p className="text-muted">
          Tools and links for exercising your right to information — සිංහල, தமிழ், and English
          resources from government and civic data pipelines.
        </p>
      </section>

      <div className="dataset-list">
        {RTI_RESOURCES.map((r) => (
          <Link key={r.title} href={r.url} className="card">
            <h3>{r.title}</h3>
            <p className="card-desc">{r.desc}</p>
          </Link>
        ))}
      </div>

      <p className="mt-2 text-muted">
        <Link href="/government">Government federation</Link>
        {" · "}
        <a href="https://www.data.gov.lk" target="_blank" rel="noopener noreferrer">
          data.gov.lk
        </a>
      </p>
    </div>
  );
}
