/** Client routes — keep in sync with `App.tsx` and GitHub Pages SPA `404.html` copy. */
export const ROUTES = {
  home: "/",
  terms: "/terms",
  termsEmbed: "/embed/terms",
  privacy: "/privacy-policy",
  privacyEmbed: "/embed/privacy",
  accountDeletion: "/delete-my-account",
  contact: "/contact",
  checkout: "/checkout",
  tools: "/tools",
  toolDetail: (slug: string) => `/tools/${slug}`,
} as const;
