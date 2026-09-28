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
