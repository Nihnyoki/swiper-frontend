import React from 'react'
import { useTelemetryContext } from './TelemetryContext'

export type TelemetryProps = {
  personId: string
  eventName?: string
  componentName: string
  injectedIndex?: number | undefined
}

export function withTelemetry<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  // Use forwardRef to preserve refs if needed
  const ComponentWithTelemetry = React.forwardRef<any, P & TelemetryProps>(
    ({ personId, eventName, componentName, ...props }, ref) => {
      const telemetry = useTelemetryContext()

      const handleEvent = (event: React.SyntheticEvent) => {
        console.log('Telemetry Event:', {
          ...telemetry,
          personId: personId,
          timestamp: new Date().toISOString(),
          event: eventName ?? 'interaction',
          component: componentName,
          eventType: event.type,
        })
      }

      // Wrap onClick to inject telemetry event
      const newProps = {
        ...props,
        onClick: (e: React.MouseEvent) => {
          handleEvent(e)
          // Call original onClick if present
          // @ts-ignore
          props.onClick?.(e)
        },
      } as P

      return <WrappedComponent {...newProps} ref={ref} />
    }
  )

  ComponentWithTelemetry.displayName = `withTelemetry(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return ComponentWithTelemetry
}
