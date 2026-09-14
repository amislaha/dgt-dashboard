import { GeomappingGeometry, GeometryType } from '../models/geomapping.model';

/**
 * Ports geomapping/index.html's "GEO MATH" section (haversine/lineLengthM/polygonAreaM2) and its
 * geometry/format helpers (fmtNum/fmtArea/fmtLen/geomToLatLngs/latLngsToGeom/geomLabel/
 * featureCentroid) verbatim.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/** The map's fixed initial centre (`GeomappingMapComponent.ngAfterViewInit`'s `setView` call) —
 *  also used by `GeomappingEditService` as the GPS-denied fallback for My Location/Tracking Point,
 *  where the source falls back to the *live* map centre (`map.getCenter()`); see that service's
 *  `requestMyLoc()` doc comment for why this port uses a fixed point instead. */
export const DEFAULT_MAP_CENTER: LatLng = { lat: -6.284, lng: 106.826 };

function toRad(d: number): number {
  return (d * Math.PI) / 180;
}

export function haversine(a: LatLng, b: LatLng): number {
  const R = 6371008.8;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function lineLengthM(ll: LatLng[]): number {
  let t = 0;
  for (let i = 1; i < ll.length; i++) {
    t += haversine(ll[i - 1], ll[i]);
  }
  return t;
}

export function polygonAreaM2(ll: LatLng[]): number {
  const pts = ll.slice();
  if (pts.length > 2 && pts[0].lat === pts[pts.length - 1].lat && pts[0].lng === pts[pts.length - 1].lng) {
    pts.pop();
  }
  const n = pts.length;
  if (n < 3) {
    return 0;
  }
  const R = 6378137;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    area += toRad(p2.lng - p1.lng) * (2 + Math.sin(toRad(p1.lat)) + Math.sin(toRad(p2.lat)));
  }
  return Math.abs((area * R * R) / 2);
}

export function fmtNum(n: number, dp?: number): string {
  return Number(n).toLocaleString('id-ID', { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 });
}

export function fmtArea(m2: number): string {
  if (!m2) {
    return '0 m²';
  }
  let s = fmtNum(m2, 2) + ' m²';
  if (m2 >= 10000) {
    s += ' (' + fmtNum(m2 / 10000, 2) + ' ha)';
  }
  return s;
}

export function fmtLen(m: number): string {
  if (!m) {
    return '0 m';
  }
  return m >= 1000 ? fmtNum(m / 1000, 2) + ' km (' + fmtNum(m, 0) + ' m)' : fmtNum(m, 1) + ' m';
}

export function fmtDur(sec: number): string {
  sec = Math.max(0, Math.round(sec));
  const hh = Math.floor(sec / 3600);
  const mm = Math.round((sec % 3600) / 60);
  if (hh) {
    return hh + ' j ' + mm + ' mnt';
  }
  if (mm) {
    return mm + ' mnt';
  }
  return '<1 mnt';
}

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function fmtWhen(ts: number): string {
  const d = new Date(ts);
  const jam = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  return HARI[d.getDay()] + ', ' + d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + d.getFullYear() + ' · ' + jam;
}

export function geomToLatLngs(g: GeomappingGeometry): LatLng[] {
  if (!g) {
    return [];
  }
  if (g.type === 'Point') {
    return [{ lat: g.coordinates[1], lng: g.coordinates[0] }];
  }
  if (g.type === 'LineString') {
    return (g.coordinates as [number, number][]).map(c => ({ lat: c[1], lng: c[0] }));
  }
  if (g.type === 'Polygon') {
    return (g.coordinates[0] as [number, number][]).slice(0, -1).map(c => ({ lat: c[1], lng: c[0] }));
  }
  return [];
}

export function latLngsToGeom(type: GeometryType, ll: LatLng[]): GeomappingGeometry {
  if (type === 'Point') {
    return { type: 'Point', coordinates: [ll[0].lng, ll[0].lat] };
  }
  if (type === 'LineString') {
    return { type: 'LineString', coordinates: ll.map(p => [p.lng, p.lat]) };
  }
  const ring = ll.map(p => [p.lng, p.lat]);
  ring.push([ll[0].lng, ll[0].lat]);
  return { type: 'Polygon', coordinates: [ring] };
}

export function geomLabel(t: GeometryType): string {
  return t === 'Point' ? 'Titik' : t === 'LineString' ? 'Garis' : 'Poligon';
}

export function featureCentroid(geometry: GeomappingGeometry): LatLng {
  const ll = geomToLatLngs(geometry);
  let la = 0;
  let lo = 0;
  ll.forEach(p => {
    la += p.lat;
    lo += p.lng;
  });
  return { lat: la / ll.length, lng: lo / ll.length };
}
