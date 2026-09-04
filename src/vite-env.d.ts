/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE?: string;
  readonly VITE_SITE_DOMAIN?: string;
  readonly VITE_HORARY_ANDROID_URL?: string;
  readonly VITE_HORARY_IOS_URL?: string;
  readonly VITE_PRASHNA_ANDROID_URL?: string;
  readonly VITE_PRASHNA_IOS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.md?raw" {
  const content: string;
  export default content;
}
