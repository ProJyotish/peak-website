/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.md?raw" {
  const content: string;
  export default content;
}
