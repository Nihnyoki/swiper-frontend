// src/lib/TelemetryContext.tsx
import React, { createContext, useContext, useMemo } from 'react'

export type TelemetryContextType = {
  session_id: string
  user_id?: string
  pwa_id: string
}

const TelemetryContext = createContext<TelemetryContextType | null>(null)

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => {
    return {
      session_id: crypto.randomUUID(),
      user_id: '369798936', // or from auth
      pwa_id: 'axsem-fem',
    }
  }, [])

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  )
}

export function useTelemetryContext() {
  const ctx = useContext(TelemetryContext)
  if (!ctx) throw new Error('TelemetryContext is missing')
  return ctx
}
