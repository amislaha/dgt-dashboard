"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** One-line description for forms and the approval summary. */
function describeGeometry(g) {
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
exports.describeGeometry = describeGeometry;
/** A single [lat, lon] to pin a shape at: the point itself, or the middle of a line/area's bounding box. */
function geometryCenter(g) {
    if (!g) {
        return null;
    }
    if (g.type === 'Point') {
        return [g.coordinates[1], g.coordinates[0]];
    }
    const ring = g.type === 'Polygon' ? g.coordinates[0] : g.coordinates;
    const lons = ring.map(c => c[0]);
    const lats = ring.map(c => c[1]);
    return [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lons) + Math.max(...lons)) / 2];
}
exports.geometryCenter = geometryCenter;
/** Vertex count (a polygon's closing point not counted). */
function geometryPointCount(g) {
    if (!g) {
        return 0;
    }
    if (g.type === 'Point') {
        return 1;
    }
    return g.type === 'Polygon' ? g.coordinates[0].length - 1 : g.coordinates.length;
}
exports.geometryPointCount = geometryPointCount;
/** Polygon area in hectares (spherical approximation, fine at kawasan scale); 0 for points/lines. */
function geometryAreaHa(g) {
    if (!g || g.type !== 'Polygon') {
        return 0;
    }
    const ring = g.coordinates[0];
    const rad = Math.PI / 180;
    const earthRadius = 6378137;
    let sum = 0;
    for (let i = 0; i < ring.length - 1; i++) {
        const [lon1, lat1] = ring[i];
        const [lon2, lat2] = ring[i + 1];
        sum += (lon2 - lon1) * rad * (2 + Math.sin(lat1 * rad) + Math.sin(lat2 * rad));
    }
    return Math.abs((sum * earthRadius * earthRadius) / 2) / 10000;
}
exports.geometryAreaHa = geometryAreaHa;
