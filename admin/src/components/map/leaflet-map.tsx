"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

interface MapPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  color?: string;
}

interface LeafletMapProps {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

export default function LeafletMap({
  points,
  center,
  zoom = 13,
  height = "400px",
  className = "",
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    fixLeafletIcon();
    if (!mapRef.current) return;

    // Destroy previous map if exists
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
      markersRef.current = [];
    }

    const defaultCenter: [number, number] = points.length > 0
      ? [points[0].latitude, points[0].longitude]
      : [10.4236, -75.5532];

    const mapCenter = center || defaultCenter;

    const map = L.map(mapRef.current, {
      center: mapCenter,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Invalidate size after creation to ensure proper rendering
    setTimeout(() => map.invalidateSize(), 100);

    // Add markers
    points.forEach((point) => {
      const markerColor = point.color || "#3b82f6";
      const markerIcon = L.divIcon({
        html: '<div style="width: 24px; height: 24px; background: ' + markerColor + '; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([point.latitude, point.longitude], { icon: markerIcon }).addTo(map);

      if (point.name) {
        const popupHtml = '<div style="font-family: system-ui, sans-serif; padding: 4px;">' +
          '<strong style="font-size: 14px;">' + point.name + '</strong>' +
          (point.description ? '<p style="margin: 4px 0 0; font-size: 12px; color: #666;">' + point.description + '</p>' : '') +
          '<p style="margin: 4px 0 0; font-size: 11px; color: #999;">' +
          point.latitude.toFixed(4) + ', ' + point.longitude.toFixed(4) +
          '</p></div>';
        marker.bindPopup(popupHtml);
      }

      markersRef.current.push(marker);
    });

    if (points.length > 1) {
      const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      markersRef.current = [];
    };
  }, [points, center, zoom]);

  return (
    <div
      ref={mapRef}
      className={"rounded-lg border overflow-hidden " + className}
      style={{ height, width: "100%" }}
    />
  );
}
