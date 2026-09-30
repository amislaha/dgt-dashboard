export type DrawGeometryType = 'Point' | 'LineString' | 'Polygon';

/** Minimal GeoJSON-shaped geometry captured by the shared map's manual draw tools (see
 *  services/map-draw.service.ts) — same coordinate order/shape as geomapping's own
 *  `GeomappingGeometry` (lon,lat), so a captured shape reads the same way if this ever needs to
 *  interop with that module later. */
export interface DrawnGeometry {
  type: DrawGeometryType;
  /** Point: [lon,lat]. LineString: [lon,lat][]. Polygon: [[lon,lat][]] (one outer ring, closed). */
  coordinates: any;
}

/** One-line description for forms and the approval summary. */
export function describeGeometry(g: DrawnGeometry | null | undefined): string {
  if (!g) {
    return '';
  }
  if (g.type === 'Point') {
    return 'Titik ditandai di peta.';
  }
  if (g.type === 'LineString') {
    return `Garis digambar (${g.coordinates.length} titik).`;
  }
  return `Area digambar (${g.coordinates[0].length - 1} titik).`;
}

/** A single [lat, lon] to pin a shape at: the point itself, or the middle of a line/area's bounding box. */
export function geometryCenter(g: DrawnGeometry | null | undefined): [number, number] | null {
  if (!g) {
    return null;
  }
  if (g.type === 'Point') {
    return [g.coordinates[1], g.coordinates[0]];
  }
  const ring: number[][] = g.type === 'Polygon' ? g.coordinates[0] : g.coordinates;
  const lons = ring.map(c => c[0]);
  const lats = ring.map(c => c[1]);
  return [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lons) + Math.max(...lons)) / 2];
}
