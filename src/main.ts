import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import '@/assets/styles/main.scss'
import { cache, createClient, dedup, defaultPlugins, handleSubscriptions, type ClientPlugin } from 'villus'
import { createClient as createWSClient } from 'graphql-ws'
import { mockResolver, mockSubscriptionForwarder } from './services/mockClient'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://api.intuition.davlo.io/graphql'
const GRAPHQL_WS_ENDPOINT = import.meta.env.VITE_GRAPHQL_WS_ENDPOINT || 'wss://api.intuition.davlo.io/graphql'

let plugins: ClientPlugin[]

if (USE_MOCKS) {
  // Fully client-side: queries and subscriptions are served by the
  // deterministic mock chain, no backend required.
  plugins = [mockSubscriptionForwarder, cache(), dedup(), mockResolver]
} else {
  plugins = [...defaultPlugins()]

  if (GRAPHQL_WS_ENDPOINT) {
    const wsClient = createWSClient({
      url: GRAPHQL_WS_ENDPOINT
    })

    const subscriptionsHandler = handleSubscriptions(operation => {
      return {
        subscribe: obs => {
          const dispose = wsClient.subscribe(
            {
              query: operation.query,
              variables: operation.variables
            },
            obs
          )

          return {
            unsubscribe: dispose
          }
        }
      }
    })

    plugins.unshift(subscriptionsHandler)
  }
}

export const villusClient = createClient({
  url: GRAPHQL_ENDPOINT,
  use: plugins
})

const app = createApp(App)

app.use(router)
app.use(villusClient)

app.mount('#app')
