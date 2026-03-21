/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
   readonly VITE_BACKEND_BASE_URL?: string
   readonly VITE_API_CORE_PATH?: string
   readonly VITE_IMAGE_CORE_PATH?: string
   readonly VITE_SUPABASE_URL?: string
   readonly VITE_SUPABASE_ANON_KEY?: string
   readonly VITE_USER_IMAGES_PATH?: string
}

interface ImportMeta {
   readonly env: ImportMetaEnv
}