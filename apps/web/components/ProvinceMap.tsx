"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry, Point } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";

type ProvinceMarker = {
  id: string;
  name: string;
  cx: number;
  cy: number;
};

function decodeTopo(topo: Topology): FeatureCollection {
  const key = Object.keys(topo.objects)[0];
  if (!key) throw new Error("empty topojson");
  return feature(topo, topo.objects[key] as GeometryCollection) as FeatureCollection;
}

function projectionFromBbox(
  bbox: [number, number, number, number],
  width: number,
  height: number,
) {
  const [x0, y0, x1, y1] = bbox;
  const corners: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [x0, y0] },
        properties: {},
      },
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [x1, y1] },
        properties: {},
      },
    ],
  };
  return geoMercator().fitExtent(
    [[24, 24], [width - 24, height - 24]],
    corners,
  );
}

export function ProvinceMap({ width = 640, height = 480 }: { width?: number; height?: number }) {
  const router = useRouter();
  const [outline, setOutline] = useState("");
  const [markers, setMarkers] = useState<ProvinceMarker[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/geo/topojson/country").then((r) => {
        if (!r.ok) throw new Error("country fetch failed");
        return r.json() as Promise<Topology>;
      }),
      fetch("/api/v1/geo/topojson/provinces").then((r) => {
        if (!r.ok) throw new Error("provinces fetch failed");
        return r.json() as Promise<Topology>;
      }),
    ])
      .then(([countryTopo, provinceTopo]) => {
        if (!countryTopo.bbox || countryTopo.bbox.length < 4) {
          throw new Error("missing bbox");
        }
        const projection = projectionFromBbox(
          countryTopo.bbox as [number, number, number, number],
          width,
          height,
        );
        const pathGen = geoPath(projection);

        const country = decodeTopo(countryTopo);
        const countryPath = pathGen(country.features[0] as Feature<Geometry>) ?? "";
        setOutline(countryPath);

        const provinces = decodeTopo(provinceTopo);
        const nextMarkers: ProvinceMarker[] = [];
        for (const f of provinces.features) {
          const props = f.properties as Record<string, string | number | undefined>;
          const lng = Number(props.center_lng);
          const lat = Number(props.center_lat);
          if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
          const projected = projection([lng, lat]);
          if (!projected) continue;
          nextMarkers.push({
            id: String(props.id ?? ""),
            name: String(props.name ?? ""),
            cx: projected[0],
            cy: projected[1],
          });
        }
        setMarkers(nextMarkers);
      })
      .catch(() => setError("Map data unavailable"));
  }, [width, height]);

  const hoveredMarker = useMemo(
    () => markers.find((m) => m.id === hovered),
    [markers, hovered],
  );

  if (error) return <p className="text-muted">{error}</p>;
  if (!outline || !markers.length) return <p className="text-muted">Loading map…</p>;

  return (
    <div className="province-map-wrap">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="province-map-svg"
        role="img"
        aria-label="Sri Lanka provinces"
      >
        <defs>
          <clipPath id="map-clip">
            <rect x="0" y="0" width={width} height={height} />
          </clipPath>
        </defs>
        <g clipPath="url(#map-clip)">
          <path d={outline} className="country-outline" />
        </g>
        {markers.map((m) => (
          <g
            key={m.id}
            className={`province-marker${hovered === m.id ? " province-marker-hover" : ""}`}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => router.push(`/regions/${m.id}`)}
            style={{ cursor: "pointer" }}
          >
            <circle cx={m.cx} cy={m.cy} r={hovered === m.id ? 14 : 10} />
            {hovered === m.id && (
              <text x={m.cx} y={m.cy - 16} textAnchor="middle" className="province-marker-label">
                {m.name}
              </text>
            )}
            <title>{m.name}</title>
          </g>
        ))}
      </svg>
      {hoveredMarker && (
        <p className="province-map-label">
          {hoveredMarker.name} ({hoveredMarker.id}) — click to explore
        </p>
      )}
    </div>
  );
}
