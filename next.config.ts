import type { NextConfig } from 'next'
import FaroSourceMapUploaderPlugin from '@grafana/faro-webpack-plugin'
import type { Compiler, Compilation } from 'webpack'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  generateBuildId: () => '7d9b94b5-ac1d-44b7-89d6-2188ed4083d9',
  crossOrigin: 'anonymous',
  webpack: (config, { isServer }) => {
    // Only apply the plugin on the client side build
    if (!isServer) {
      // Add custom plugin to modify source map file property
      config.plugins.push({
        apply: (compiler: Compiler) => {
          compiler.hooks.emit.tapAsync(
            'SourceMapFilePrefixPlugin',
            (compilation: Compilation, callback: () => void) => {
              // Find all .map files and modify their file property
              Object.keys(compilation.assets).forEach((filename) => {
                if (filename.endsWith('.map')) {
                  const asset = compilation.assets[filename]
                  const source = asset.source()
                  const sourceMap = JSON.parse(source as string)

                  // Add _next/ prefix to the file property if it doesn't already have it
                  if (sourceMap.file && !sourceMap.file.startsWith('_next/')) {
                    sourceMap.file = `_next/${sourceMap.file}`
                    compilation.assets[filename] = {
                      source: () => JSON.stringify(sourceMap, null, 2),
                      size: () => JSON.stringify(sourceMap, null, 2).length,
                    } as typeof asset
                  }
                }
              })
              callback()
            }
          )
        },
      })
      config.plugins.push(
        new FaroSourceMapUploaderPlugin({
          appName: 'auth-ui',
          endpoint:
            'https://faro-api-prod-ap-northeast-0.grafana.net/faro/api/v1',
          appId: '76',
          stackId: '1170640',
          // instructions on how to obtain your API key are in the documentation
          // https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/sourcemap-upload-plugins/#obtain-an-api-key
          apiKey: process.env.FARO_API_KEY || '',
          gzipContents: true,
          outputPath: './.next/static/chunks',
          // outputFiles: [
          //   './.next/static/chunks/*.js.map',
          //   './.next/static/chunks/pages/*.js.map',
          // ],
          bundleId: '7d9b94b5-ac1d-44b7-89d6-2188ed4083d9',
          verbose: true,
          keepSourcemaps: true,
          recursive: true,
          // Skip upload during development or if no API key is provided
          skipUpload:
            !process.env.FARO_API_KEY || process.env.NODE_ENV === 'development',
        })
      )
    }
    return config
  },
}

export default nextConfig
