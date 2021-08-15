import { BBox, Feature, FeatureCollection, Point, Polygon, featureCollection, polygon } from '@turf/helpers'

import { Delaunay } from 'd3-delaunay'
import { collectionOf } from '@turf/invariant'

interface Options {
  keepProperties?: boolean
  bbox?: BBox
}

/**
 * Takes a FeatureCollection of points, and a bounding box, and returns a FeatureCollection
 * of Voronoi polygons.
 *
 * The Voronoi algorithim used comes from the d3-delaunay package.
 *
 * @name voronoi
 * @param {FeatureCollection<Point>} points to find the Voronoi polygons around.
 * @param {Options} [options={ keepProperties: false, bbox: [-180, -85, 180, -85] }] Optional parameters
 * @param {boolean} [options.keepProperties=false] switch to enable/disable preservation of feature properties
 * @param {BBox} [options.bbox=[-180, -85, 180, -85]] clipping rectangle, in [minX, minY, maxX, MaxY] order.
 * @returns {FeatureCollection<Polygon>} a set of polygons, one per input point.
 * @example
 * const options = {
 *   bbox: [-70, 40, -60, 60]
 * };
 * const points = turf.randomPoint(100, options);
 * const voronoiPolygons = voronoiDelaunay(points, options);
 *
 * //addToMap
 * const addToMap = [voronoiPolygons, points];
 */
function voronoi (points: FeatureCollection<Point>, options?: Options): FeatureCollection<Polygon> {
  const bbox = options?.bbox ?? [-180, -85, 180, 85]
  if (!Array.isArray(bbox)) throw new Error('bbox is invalid')
  collectionOf(points, 'Point', 'points')

  const fc = featureCollection(
    Array.from(Delaunay.from<Feature<Point>>(points.features, feature => feature.geometry.coordinates[0], feature => feature.geometry.coordinates[1])
      .voronoi([bbox[0], bbox[1], bbox[2], bbox[3]])
      .cellPolygons())
      .map((p: Delaunay.Polygon) => polygon([p])))

  if (options?.keepProperties === true) {
    fc.features.forEach((polygon: Feature, i: number) => {
      polygon.properties = JSON.parse(JSON.stringify(points.features[i].properties))
    })
  }

  return fc
}

export default voronoi
