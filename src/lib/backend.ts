import axios from 'axios'

function cleanBaseUrl(url: string) {
  return url.replace(/\/+$/, '')
}

function resolveBackendBaseUrl(): string {
  const candidate =
    import.meta.env.VITE_BACKEND_BASE_URL ?? import.meta.env.VITE_API_CORE_PATH

  if (!candidate || typeof candidate !== 'string') {
    throw new Error(
      'Missing backend base URL. Define VITE_BACKEND_BASE_URL (or VITE_API_CORE_PATH) in your environment variables at build time.'
    )
  }

  return cleanBaseUrl(candidate)
}

export const BACKEND_BASE_URL = resolveBackendBaseUrl()

export function backendUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${BACKEND_BASE_URL}${p}`
}

export async function backendFetch(path: string, init?: RequestInit) {
  return fetch(backendUrl(path), init)
}

export const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 20000,
})
