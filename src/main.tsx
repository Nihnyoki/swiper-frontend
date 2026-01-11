import { StrictMode } from 'react'
//<script src="http://localhost:8097"></script>
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import React from 'react'
import { TelemetryProvider } from './lib/TelemetryContext'
import { registerSW } from 'virtual:pwa-register'

import './index.css'

import "leaflet/dist/leaflet.css";


// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
import * as PropTypes from 'prop-types'
console.log(PropTypes.string); // should NOT be undefined
if (!rootElement.innerHTML) {
  
  registerSW({
  onNeedRefresh() {
    console.log('New content available, refresh needed.')
  },
  onOfflineReady() {
    console.log('App ready to work offline.')
  },
})

  const root = ReactDOM.createRoot(rootElement)


  root.render(
    <StrictMode>
    <TelemetryProvider>
      <RouterProvider router={router} />
    </TelemetryProvider>
  </StrictMode>,
  )
}