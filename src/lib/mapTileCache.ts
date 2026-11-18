'use client';

import * as maplibregl from 'maplibre-gl';

const MAP_CACHE_NAME = 'khatti-map-tiles-v1';
let isProtocolRegistered = false;

/**
 * Registers an offline-first caching protocol for MapLibre GL JS.
 * Intercepts tile requests, stores them in the browser's Cache Storage,
 * and serves cached tiles seamlessly when offline or connectivity drops.
 */
export function registerMapTileCacheProtocol() {
  if (typeof window === 'undefined' || isProtocolRegistered) {
    return;
  }

  try {
    maplibregl.addProtocol('cached-tile', async (params: { url: string }, abortController: AbortController) => {
      const tileUrl = params.url.replace('cached-tile://', '');

      // Check if Cache API is available in browser / Capacitor webview
      if ('caches' in window) {
        try {
          const cache = await caches.open(MAP_CACHE_NAME);
          const cachedResponse = await cache.match(tileUrl);

          // If cached tile exists, return it immediately from memory buffer
          if (cachedResponse) {
            const data = await cachedResponse.arrayBuffer();
            return { data };
          }

          // Otherwise fetch from network and store in cache buffer
          const networkResponse = await fetch(tileUrl, {
            signal: abortController.signal,
          });

          if (networkResponse.ok) {
            // Put cloned response into cache storage
            cache.put(tileUrl, networkResponse.clone()).catch(() => {
              // Ignore cache quota errors safely
            });
            const data = await networkResponse.arrayBuffer();
            return { data };
          }
        } catch {
          // If network failed (offline), check cache one more time
          const cache = await caches.open(MAP_CACHE_NAME);
          const fallbackCached = await cache.match(tileUrl);
          if (fallbackCached) {
            const data = await fallbackCached.arrayBuffer();
            return { data };
          }
        }
      }

      // Default network fetch fallback
      const directResponse = await fetch(tileUrl, {
        signal: abortController.signal,
      });
      const data = await directResponse.arrayBuffer();
      return { data };
    });

    isProtocolRegistered = true;
  } catch (err) {
    // Protocol might already be registered in HMR
    console.warn('MapLibre cache protocol already active:', err);
  }
}

/**
 * Gets the total number of cached tiles stored locally.
 */
export async function getCachedTileCount(): Promise<number> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return 0;
  }
  try {
    const cache = await caches.open(MAP_CACHE_NAME);
    const keys = await cache.keys();
    return keys.length;
  } catch {
    return 0;
  }
}

/**
 * Clears all locally cached map tiles.
 */
export async function clearMapTileCache(): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return false;
  }
  try {
    await caches.delete(MAP_CACHE_NAME);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generates a MapLibre style JSON for a given tile provider with cached-tile protocol support.
 */
export function getMapStyle(styleType: 'voyager' | 'osm' | 'dark', maptilerKey?: string): maplibregl.StyleSpecification {
  // If MapTiler key is provided, use MapTiler high-res vector style
  if (maptilerKey && maptilerKey.trim().length > 0) {
    return `https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilerKey}` as unknown as maplibregl.StyleSpecification;
  }

  // Define tile endpoints
  let tileUrl = 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png';
  let attribution = '© CartoDB, © OpenStreetMap contributors';

  if (styleType === 'osm') {
    tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    attribution = '© OpenStreetMap contributors';
  } else if (styleType === 'dark') {
    tileUrl = 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png';
    attribution = '© CartoDB, © OpenStreetMap contributors';
  }

  // Wrap tile URL with offline caching protocol
  const cachedUrl = `cached-tile://${tileUrl}`;

  return {
    version: 8,
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: [cachedUrl],
        tileSize: 256,
        attribution,
      },
    },
    layers: [
      {
        id: 'simple-tiles',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  };
}
