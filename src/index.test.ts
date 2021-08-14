import { FeatureCollection, Point } from '@turf/helpers'

import glob from 'glob'
import load from 'load-json-file'
import path from 'path'
import voronoiDelaunay from './index'
import write from 'write-json-file'

describe('basic', () => {
  const files = glob.sync(path.join(__dirname, '..', 'test', 'in', '!(*-keep).json'))
  for (const file of files) {
    const { name } = path.parse(file)
    it(name, () => {
      // arrange
      const geojson = load.sync<FeatureCollection<Point>>(file)
      const out = file.replace(
        path.join('test', 'in'),
        path.join('test', 'out')
      )
      const expected = load.sync(out)

      // act
      const results = voronoiDelaunay(geojson, { bbox: geojson.bbox })
      if (process.env.REGEN !== undefined) write.sync(out, results)

      // assert
      expect(JSON.stringify(results)).toEqual(JSON.stringify(expected))
    })
  }
})

describe('keep-properties', () => {
  const files = glob.sync(path.join(__dirname, '..', 'test', 'in', '*-keep.json'))
  for (const file of files) {
    const { name } = path.parse(file)
    it(name, () => {
      // arrange
      const geojson = load.sync<FeatureCollection<Point>>(file)
      const out = file.replace(
        path.join('test', 'in'),
        path.join('test', 'out')
      )
      const expected = load.sync(out)

      // act
      const result = voronoiDelaunay(geojson, { keepProperties: true, bbox: geojson.bbox })
      if (process.env.REGEN !== undefined) write.sync(out, result)

      // assert
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expected))
    })
  }
})
