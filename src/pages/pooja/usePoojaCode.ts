import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  checkPoojaCode,
  normalizePoojaCode,
  rememberPoojaCode,
  rememberedPoojaCode,
  trackPooja,
  type SelectedAddon,
} from "@/lib/pooja";

const ADDONS_DEBOUNCE_MS = 500;

function useDebounced<T>(value: T, ms: number): T {
  const serialized = JSON.stringify(value);
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(JSON.parse(serialized) as T), ms);
    return () => clearTimeout(t);
  }, [serialized, ms]);
  return debounced;
}

/**
 * Pandit / discount code for a pooja booking. Seeded from `?code=` (affiliate links) or the code
 * remembered this session, validated against Shopify for the current cart, and mirrored back into
 * the URL so the page can be shared as-is.
 */
export function usePoojaCode(slug: string, selectedAddons: SelectedAddon[], ready: boolean) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [code, setCode] = useState<string | null>(() => normalizePoojaCode(searchParams.get("code")));

  useEffect(() => {
    if (!code) setCode(rememberedPoojaCode());
    // Seed once on mount; later changes come from apply/remove.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addons = useDebounced(
    selectedAddons.map((a) => ({ variantId: a.variantId, quantity: a.quantity })),
    ADDONS_DEBOUNCE_MS,
  );
  const query = useQuery({
    queryKey: ["pooja-code", slug, code, addons],
    queryFn: () => checkPoojaCode({ code: code as string, slug, addons }),
    enabled: ready && Boolean(code),
    placeholderData: keepPreviousData,
    // The API throttles code checks per visitor; only that is worth retrying.
    retry: (count, error) => count < 2 && /wait a moment/i.test(error.message),
    retryDelay: 1200,
    staleTime: 60_000,
  });

  const applied = !query.isError && query.data && query.data.code === code ? query.data : null;

  const setUrlCode = useCallback(
    (next: string | null) =>
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next) params.set("code", next);
          else params.delete("code");
          return params;
        },
        { replace: true },
      ),
    [setSearchParams],
  );

  const appliedCode = applied?.code ?? null;
  useEffect(() => {
    if (!appliedCode) return;
    rememberPoojaCode(appliedCode);
    if (searchParams.get("code") !== appliedCode) setUrlCode(appliedCode);
    trackPooja("pooja_code_applied", { slug, code: appliedCode });
    // Only react to a newly applied code.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedCode]);

  useEffect(() => {
    if (query.isError) rememberPoojaCode(null);
  }, [query.isError]);

  const remove = useCallback(() => {
    setCode(null);
    rememberPoojaCode(null);
    setUrlCode(null);
  }, [setUrlCode]);

  return {
    code,
    applied,
    checking: query.isFetching && !applied,
    error: query.isError ? (query.error as Error).message || "This code isn't valid." : null,
    apply: setCode,
    remove,
  };
}
