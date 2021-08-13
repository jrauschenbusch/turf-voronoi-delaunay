import { FeatureCollection, Point } from '@turf/helpers'

import glob from 'glob'
import load from 'load-json-file'
import path from 'path'
import voronoiDelaunay from './index'
import write from 'write-json-file'

describe('turf-voronoi-delaunay', () => {
  const files = glob.sync(path.join(__dirname, '..', 'test', 'in', '*.json'))
  for (const file of files) {
    const { name } = path.parse(file)
    it(name, () => {
      const geojson = load.sync<FeatureCollection<Point>>(file)
      const results = voronoiDelaunay(geojson, { bbox: geojson.bbox })

      const out = file.replace(
        path.join('test', 'in'),
        path.join('test', 'out')
      )

      if (process.env.REGEN !== undefined) write.sync(out, results)

      const expected = load.sync(out)

      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected))
    })
  }
})
