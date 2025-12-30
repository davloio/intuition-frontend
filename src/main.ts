import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import '@/assets/styles/main.scss'
import { createClient, defaultPlugins, handleSubscriptions } from 'villus'
import { createClient as createWSClient } from 'graphql-ws'

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://api.intuition.davlo.io/graphql'
const GRAPHQL_WS_ENDPOINT = import.meta.env.VITE_GRAPHQL_WS_ENDPOINT || 'wss://api.intuition.davlo.io/graphql'

if (!GRAPHQL_ENDPOINT) {
  console.error('VITE_GRAPHQL_ENDPOINT is not defined!')
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const plugins = [...defaultPlugins()]

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

export const villusClient = createClient({
  url: GRAPHQL_ENDPOINT,
  use: plugins
})

app.use(villusClient)

app.mount('#app')
