'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  registerMapTileCacheProtocol,
  getMapStyle,
  getCachedTileCount,
  clearMapTileCache,
} from '@/lib/mapTileCache';

export interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
  status: 'passed' | 'current' | 'upcoming';
}

interface KhattiInteractiveMapProps {
  busLocation?: { lat: number; lng: number; heading?: number; speed?: number };
  homeLocation?: { lat: number; lng: number; label?: string };
  schoolLocation?: { lat: number; lng: number; name?: string };
  stops?: RouteStop[];
  geofenceRadiusMeters?: number;
  heightClassName?: string;
  interactive?: boolean;
}

export const KhattiInteractiveMap: React.FC<KhattiInteractiveMapProps> = ({
  busLocation = { lat: 33.3152, lng: 44.3661, heading: 45, speed: 34 },
  homeLocation = { lat: 33.3080, lng: 44.3590, label: 'منزل الطالبة زينب' },
  schoolLocation = { lat: 33.3280, lng: 44.3720, name: 'ثانوية المتميزات الأولى' },
  stops = [
    { id: '1', name: 'اليرموك - مأكولات الرواد', lat: 33.3152, lng: 44.3661, order: 1, status: 'current' },
    { id: '2', name: 'حي الجامعة - شارع الربيع', lat: 33.3190, lng: 44.3620, order: 2, status: 'upcoming' },
    { id: '3', name: 'المنصور - 14 رمضان', lat: 33.3240, lng: 44.3680, order: 3, status: 'upcoming' },
  ],
  geofenceRadiusMeters = 500,
  heightClassName = 'h-80 sm:h-96',
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const busMarkerRef = useRef<maplibregl.Marker | null>(null);

  const [activeStyle, setActiveStyle] = useState<'voyager' | 'osm' | 'dark'>('voyager');
  const [cachedTiles, setCachedTiles] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);

  // Helper to create GeoJSON circle for 500m geofence
  const createGeoJsonCircle = (center: [number, number], radiusInKm: number, points = 64) => {
    const coords: [number, number][] = [];
    const distanceX = radiusInKm / (111.32 * Math.cos((center[1] * Math.PI) / 180));
    const distanceY = radiusInKm / 110.574;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);
      coords.push([center[0] + x, center[1] + y]);
    }
    coords.push(coords[0]);

    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coords],
      },
      properties: {},
    };
  };

  // Initialize Map
  useEffect(() => {
    registerMapTileCacheProtocol();

    // Check connectivity
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', () => setIsOnline(true));
      window.addEventListener('offline', () => setIsOnline(false));
      getCachedTileCount().then(setCachedTiles);
    }

    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMapStyle(activeStyle),
      center: [busLocation.lng, busLocation.lat],
      zoom: 14,
      pitch: 35,
      bearing: 15,
      interactive,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      // Add 500m Geofence Layer around Home
      const circleGeoJson = createGeoJsonCircle([homeLocation.lng, homeLocation.lat], geofenceRadiusMeters / 1000);

      map.addSource('geofence-500m', {
        type: 'geojson',
        data: circleGeoJson,
      });

      map.addLayer({
        id: 'geofence-500m-fill',
        type: 'fill',
        source: 'geofence-500m',
        paint: {
          'fill-color': '#10B981',
          'fill-opacity': 0.15,
        },
      });

      map.addLayer({
        id: 'geofence-500m-line',
        type: 'line',
        source: 'geofence-500m',
        paint: {
          'line-color': '#10B981',
          'line-width': 2,
          'line-dasharray': [2, 2],
        },
      });

      // Route Line between stops
      const routeCoordinates = [
        [busLocation.lng, busLocation.lat],
        ...stops.map((s) => [s.lng, s.lat]),
        [schoolLocation.lng, schoolLocation.lat],
      ];

      map.addSource('route-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates,
          },
          properties: {},
        },
      });

      map.addLayer({
        id: 'route-line-bg',
        type: 'line',
        source: 'route-line',
        paint: {
          'line-color': '#F59E0B',
          'line-width': 4,
          'line-opacity': 0.8,
        },
      });

      // Add Home Marker
      const homeEl = document.createElement('div');
      homeEl.className = 'khatti-marker-home flex flex-col items-center cursor-pointer';
      homeEl.innerHTML = `
        <div class="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-md text-[10px] font-bold text-slate-900 dark:text-white whitespace-nowrap mb-1">
          🏠 ${homeLocation.label || 'المنزل'}
        </div>
        <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-xs shadow-md">
          ●
        </div>
      `;
      new maplibregl.Marker({ element: homeEl })
        .setLngLat([homeLocation.lng, homeLocation.lat])
        .addTo(map);

      // Add School Marker
      const schoolEl = document.createElement('div');
      schoolEl.className = 'khatti-marker-school flex flex-col items-center cursor-pointer';
      schoolEl.innerHTML = `
        <div class="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-md text-[10px] font-bold text-slate-900 dark:text-white whitespace-nowrap mb-1">
          🏫 ${schoolLocation.name || 'المدرسة'}
        </div>
        <div class="w-7 h-7 rounded-xl bg-purple-600 border-2 border-white flex items-center justify-center text-white text-sm shadow-md">
          🎓
        </div>
      `;
      new maplibregl.Marker({ element: schoolEl })
        .setLngLat([schoolLocation.lng, schoolLocation.lat])
        .addTo(map);

      // Add Bus Marker with Heading Pulse
      const busEl = document.createElement('div');
      busEl.className = 'khatti-marker-bus relative flex items-center justify-center';
      busEl.innerHTML = `
        <span class="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-amber-400 opacity-60"></span>
        <div class="relative w-10 h-10 rounded-2xl bg-amber-500 text-slate-900 flex items-center justify-center text-xl shadow-lg border-2 border-white transform transition-transform duration-300">
          🚌
        </div>
      `;
      const busMarker = new maplibregl.Marker({ element: busEl })
        .setLngLat([busLocation.lng, busLocation.lat])
        .addTo(map);

      busMarkerRef.current = busMarker;

      // Update cached tile count after map loads initial tiles
      getCachedTileCount().then(setCachedTiles);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync Bus Location updates
  useEffect(() => {
    if (busMarkerRef.current) {
      busMarkerRef.current.setLngLat([busLocation.lng, busLocation.lat]);
    }
  }, [busLocation.lat, busLocation.lng]);

  // Handle Style Switch
  const handleSwitchStyle = (style: 'voyager' | 'osm' | 'dark') => {
    setActiveStyle(style);
    if (mapRef.current) {
      mapRef.current.setStyle(getMapStyle(style));
      getCachedTileCount().then(setCachedTiles);
    }
  };

  // Center on Bus
  const handleRecenterBus = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [busLocation.lng, busLocation.lat],
        zoom: 15,
        speed: 1.2,
      });
    }
  };

  // Clear Tile Cache
  const handleClearCache = async () => {
    await clearMapTileCache();
    setCachedTiles(0);
    setCacheNotice('تم إفراغ بافر وكاش الخريطة بنجاح.');
  };

  return (
    <div className={`relative w-full ${heightClassName} rounded-3xl overflow-hidden border border-surface-borderLight dark:border-surface-borderDark shadow-inner bg-slate-900`}>
      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top HUD: Speed, Telemetry & Status */}
      <div className="absolute top-3 right-3 left-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10 text-xs">
        {/* Left Status: Connectivity & Buffer */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-white shadow-sm">
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-safety animate-pulse' : 'bg-bus'}`}></span>
          <span className="font-bold">
            {isOnline ? 'بث Traccar حي' : 'يعمل من بافر الكاش (Offline)'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-[11px] text-bus">
            💾 {cachedTiles} بلاطة في الكاش
          </span>
        </div>

        {/* Right Status: Speedometer & Geofence Badge */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-bus font-bold shadow-sm">
            السرعة: {busLocation.speed || 34} كم/ساعة
          </div>

          <div className="bg-safety-subtle/90 dark:bg-safety-subtleDark/90 backdrop-blur-md text-safety-darkText dark:text-safety px-3 py-1.5 rounded-2xl border border-safety/30 font-bold shadow-sm">
            السياج: 500م آمن
          </div>
        </div>
      </div>

      {/* Bottom Floating Map Controls Bar */}
      <div className="absolute bottom-3 right-3 left-3 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none text-xs">
        {/* Map Styles Selector */}
        <div className="pointer-events-auto flex items-center p-1 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 shadow-md">
          <button
            type="button"
            onClick={() => handleSwitchStyle('voyager')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
              activeStyle === 'voyager'
                ? 'bg-bus text-slate-900 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            شوارع العراق
          </button>
          <button
            type="button"
            onClick={() => handleSwitchStyle('osm')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
              activeStyle === 'osm'
                ? 'bg-bus text-slate-900 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            OSM المفتوحة
          </button>
          <button
            type="button"
            onClick={() => handleSwitchStyle('dark')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
              activeStyle === 'dark'
                ? 'bg-bus text-slate-900 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            الوضع الليلي
          </button>
        </div>

        {/* Actions: Recenter & Cache Clear */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleRecenterBus}
            className="px-3 py-1.5 rounded-2xl bg-brand hover:bg-brand-hover text-white font-bold shadow-ambient-brand flex items-center gap-1.5 transition-all"
            title="توسيط الخريطة على موقع الحافلة الحقيقي"
          >
            <span>📍</span>
            <span>توسيط الباص</span>
          </button>

          <button
            type="button"
            onClick={handleClearCache}
            className="px-2.5 py-1.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition-colors"
            title="إفراغ بلاطات الخريطة من ذاكرة التخزين المؤقت"
          >
            إفراغ الكاش
          </button>
        </div>
      </div>

      {/* Dismissible Notice */}
      {cacheNotice && (
        <div className="absolute top-14 left-4 right-4 z-20 p-2.5 rounded-xl bg-slate-900/95 border border-safety text-safety text-xs font-bold flex items-center justify-between shadow-lg">
          <span>{cacheNotice}</span>
          <button
            type="button"
            onClick={() => setCacheNotice(null)}
            className="text-white hover:underline px-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
