export function track(
  event: string,
  payload?: Record<string, unknown>
) {
  // Intentionally simple — swap provider later
  console.log(`[telemetry] ${event}`, payload);
}
