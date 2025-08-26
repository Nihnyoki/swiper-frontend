import { StrictMode } from 'react'
<script src="http://localhost:8097"></script>
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import React from 'react'
import { TelemetryProvider } from './lib/TelemetryContext'

import './index.css'

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
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
    <TelemetryProvider>
      <RouterProvider router={router} />
    </TelemetryProvider>
  </StrictMode>,
  )
}