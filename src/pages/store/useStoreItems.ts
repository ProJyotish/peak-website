import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPoojaCatalog, poojaKeys } from "@/lib/pooja";
import { poojaToItem, type StoreItem } from "@/lib/store";

/** Every category's items as store tiles. New categories add their query here. */
export function useStoreItems() {
  const pooja = useQuery({ queryKey: poojaKeys.catalog, queryFn: fetchPoojaCatalog, staleTime: 5 * 60_000 });
  const items = useMemo<StoreItem[]>(() => (pooja.data?.pujas ?? []).map(poojaToItem), [pooja.data]);
  return { items, isLoading: pooja.isLoading, isError: pooja.isError, refetch: pooja.refetch };
}
