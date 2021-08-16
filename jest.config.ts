import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
  coverageReporters: ['lcov', 'text'],
  verbose: true,
  transformIgnorePatterns: [
    'node_modules/?!(d3-delaunay)'
  ]
}

export default config
