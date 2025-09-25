import type { NextConfig } from 'next'
import FaroSourceMapUploaderPlugin from '@grafana/faro-webpack-plugin'
import type { Compiler, Compilation } from 'webpack'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  generateBuildId: () => '7d9b94b5-ac1d-44b7-89d6-2188ed4083d9',
  crossOrigin: 'anonymous',
  assetPrefix: 'https://cdn.jsdelivr.net/gh/XChangLab/faro-demo@main',
  webpack: (config, { isServer }) => {
    // Only apply the plugin on the client side build
    if (!isServer) {
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
          nextjs: true,
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
