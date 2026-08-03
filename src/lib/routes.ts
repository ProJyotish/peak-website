/** Client routes — keep in sync with `App.tsx` and GitHub Pages SPA `404.html` copy. */
export const ROUTES = {
  home: "/",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}` as const,
  terms: "/terms",
  termsEmbed: "/embed/terms",
  privacy: "/privacy-policy",
  privacyEmbed: "/embed/privacy",
  accountDeletion: "/delete-my-account",
  contact: "/contact",
  contactEmbed: "/embed/contact",
  checkout: "/checkout",
} as const;
