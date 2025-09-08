import type { NextConfig } from 'next'
import FaroSourceMapUploaderPlugin from '@grafana/faro-webpack-plugin'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    console.log('ccc', config)
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
        outputPath: '.next',
      })
    )

    return config
  },
}

export default nextConfig
