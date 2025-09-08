import { faro, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'


export default function FrontendObservability({
}): null {
  // skip if already initialized
  if (faro.api) {
    return null
  }

  try {
    initializeFaro({
      url: 'https://faro-collector-prod-ap-northeast-0.grafana.net/collect/1c8bf52d49f406b79e9f9605bf7b9037',
      app: {
        name: 'auth-ui',
        version: '1.0.0',
        environment: 'production'
      },
      instrumentations: [
        // Mandatory, omits default instrumentations otherwise.
        ...getWebInstrumentations(),

        // Tracing package to get end-to-end visibility for HTTP requests.
        new TracingInstrumentation(),
      ],
    })
  } catch {
    return null
  }
  return null
}