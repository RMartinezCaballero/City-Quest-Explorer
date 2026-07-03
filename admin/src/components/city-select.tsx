"use client";

import { useEffect, useState } from "react";
import { citiesApi, type City } from "@/lib/api";
import { Globe } from "lucide-react";

interface CitySelectProps {
  value: string;
  onChange: (cityId: string) => void;
  placeholder?: string;
  className?: string;
  includeAll?: boolean;
  allLabel?: string;
  disabled?: boolean;
}

export default function CitySelect({
  value,
  onChange,
  placeholder = "Seleccionar ciudad",
  className = "",
  includeAll = false,
  allLabel = "Todas las ciudades",
  disabled = false,
}: CitySelectProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await citiesApi.list();
        if (!cancelled) setCities(data);
      } catch (e) {
        console.error("Error loading cities:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="relative">
      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className={`flex h-9 w-full rounded-lg border border-input bg-transparent py-2 pl-9 pr-8 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${className}`}
      >
        {loading ? (
          <option value="">Cargando ciudades...</option>
        ) : (
          <>
            <option value="">{placeholder}</option>
            {includeAll && <option value="all">{allLabel}</option>}
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name} — {city.country}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
}
