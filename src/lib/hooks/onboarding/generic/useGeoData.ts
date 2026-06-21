"use client";

import { useQuery } from "@tanstack/react-query";
import { Country as CscCountry, City as CscCity } from "country-state-city";
import { apiClient } from "@/lib/apiClient";

export type GeoCountry = {
  id: string;
  name: string;
  shortname: string;
  country_code: string;
  active: boolean;
};

/** Strip noise words ("Republic", "The", etc.) so "Benin Republic" -> "benin". */
function normalizeName(name: string): string {
  return (name || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(
      /\b(republic|rep|the)\b/g,
      "",
    )
    .replace(/[^a-z]/g, "");
}

/**
 * Resolve an AutoGirl country to a `country-state-city` ISO2 code. AutoGirl's
 * `country_code` isn't guaranteed to be a clean ISO2, so we try several
 * strategies before falling back to a normalized name match.
 */
function resolveIsoCode(
  country: Pick<GeoCountry, "name" | "country_code" | "shortname">,
): string | undefined {
  const all = CscCountry.getAllCountries();
  const code = (country.country_code || "").trim().toUpperCase();
  const short = (country.shortname || "").trim().toUpperCase();

  // 1. Direct ISO2 via country_code or shortname.
  for (const candidate of [code, short]) {
    if (candidate.length === 2 && CscCountry.getCountryByCode(candidate)) {
      return candidate;
    }
  }

  // 2. Phone code (e.g. "229" for Benin).
  const digits = (code.match(/\d+/)?.[0] || short.match(/\d+/)?.[0]) ?? "";
  if (digits) {
    const byPhone = all.find((c) => c.phonecode.replace(/\D/g, "") === digits);
    if (byPhone) return byPhone.isoCode;
  }

  // 3. Name match: exact, then normalized, then partial.
  const name = (country.name || "").trim().toLowerCase();
  const target = normalizeName(name);
  const exact = all.find((c) => c.name.toLowerCase() === name);
  if (exact) return exact.isoCode;
  const normalized = all.find((c) => normalizeName(c.name) === target);
  if (normalized) return normalized.isoCode;
  const partial =
    target.length > 2
      ? all.find((c) => {
          const n = normalizeName(c.name);
          return n.length > 2 && (n.includes(target) || target.includes(n));
        })
      : undefined;
  return partial?.isoCode;
}

export type GeoCityOption = {
  id: string;
  name: string;
};

/** Country list comes from AutoGirl (only the countries it supports). */
export function useCountries() {
  return useQuery<GeoCountry[]>({
    queryKey: ["countries"],
    queryFn: () => apiClient.get<GeoCountry[]>("/countries"),
  });
}

/**
 * Resolve the full, real-world list of cities for a country using the offline
 * `country-state-city` dataset (not limited to what AutoGirl has configured).
 * We match the AutoGirl country to an ISO2 code via its `country_code`, falling
 * back to a name match. Cities are deduped by name and sorted alphabetically.
 */
export function getCitiesForCountry(
  country?: Pick<GeoCountry, "name" | "country_code" | "shortname"> | null,
): GeoCityOption[] {
  if (!country) return [];

  const isoCode = resolveIsoCode(country);
  if (!isoCode) return [];

  const seen = new Set<string>();
  return (CscCity.getCitiesOfCountry(isoCode) ?? [])
    .reduce<GeoCityOption[]>((acc, city) => {
      const id = city.name.toLowerCase();
      if (!seen.has(id)) {
        seen.add(id);
        acc.push({ id, name: city.name });
      }
      return acc;
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name));
}
