"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";

type ProvincePath = { id: string; name: string; d: string };

export function ProvinceMap({ width = 640, height = 480 }: { width?: number; height?: number }) {
  const router = useRouter();
  const [features, setFeatures] = useState<Feature<Geometry>[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/geo/topojson/provinces")
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json() as Promise<Topology>;
      })
      .then((topo) => {
        const key = Object.keys(topo.objects)[0];
        if (!key) throw new Error("empty topojson");
        const collection = topo.objects[key] as GeometryCollection;
        const geo = feature(topo, collection) as FeatureCollection;
        setFeatures(geo.features);
      })
      .catch(() => setError("Map data unavailable"));
  }, []);

  const paths = useMemo((): ProvincePath[] => {
    if (!features.length) return [];
    const fc: FeatureCollection = { type: "FeatureCollection", features };
    const projection = geoMercator().fitSize([width, height], fc);
    const pathGen = geoPath(projection);
    return features.map((f) => ({
      id: String(f.properties?.id ?? ""),
      name: String(f.properties?.name ?? ""),
      d: pathGen(f) ?? "",
    }));
  }, [features, width, height]);

  if (error) return <p className="text-muted">{error}</p>;
  if (!paths.length) return <p className="text-muted">Loading map…</p>;

  const hoveredName = paths.find((p) => p.id === hovered)?.name;

  return (
    <div className="province-map-wrap">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="province-map-svg"
        role="img"
        aria-label="Sri Lanka provinces"
      >
        {paths.map((p) => (
          <path
            key={p.id}
            d={p.d}
            className={`province-path${hovered === p.id ? " province-path-hover" : ""}`}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => router.push(`/regions/${p.id}`)}
          >
            <title>{p.name}</title>
          </path>
        ))}
      </svg>
      {hoveredName && (
        <p className="province-map-label">
          {hoveredName} — click to explore
        </p>
      )}
    </div>
  );
}
