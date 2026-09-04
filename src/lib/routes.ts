/** Client routes — keep in sync with `App.tsx` and SPA `404.html` copy. */
export const ROUTES = {
  home: "/",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}` as const,
  product: "/product",
  productPage: (slug: string) => `/product/${slug}` as const,
  terms: "/terms",
  termsEmbed: "/embed/terms",
  privacy: "/privacy-policy",
  privacyEmbed: "/embed/privacy",
  accountDeletion: "/delete-my-account",
  contact: "/contact",
  checkout: "/checkout",
  astrocartography: "/tools/astrocartography",
} as const;
