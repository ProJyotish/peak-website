/** Append standard UTM params for marketing attribution. */
export function withUtm(
  url: string,
  content: string,
  {
    source = "website",
    medium = "cta",
    campaign = "homepage",
  }: { source?: string; medium?: string; campaign?: string } = {},
): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", medium);
  u.searchParams.set("utm_campaign", campaign);
  u.searchParams.set("utm_content", content);
  return u.toString();
}
