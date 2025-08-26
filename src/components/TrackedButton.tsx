import React from 'react'
import { Button } from '@/components/ui/button'
import { withTelemetry, TelemetryProps } from '@/lib/withTelemetry'

type ButtonProps = React.ComponentProps<typeof Button> & TelemetryProps

function RawButton(props: ButtonProps) {
  const { eventName, componentName, ...buttonProps } = props
  return <Button {...buttonProps} />
}

export const TrackedButton = withTelemetry(RawButton)
