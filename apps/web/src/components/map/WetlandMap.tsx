import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { SEVERITY_CONFIG } from '@utils/severity';
import { useFilterStore } from '@stores/filter.store';
import { useUiStore } from '@stores/ui.store';
import { useReports } from '@features/reports/hooks/useReports';
import type { SeverityLevel } from '@wetlabs/shared-types';

const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const SAT_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const DEM_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}';

function makeMarker(severity?: SeverityLevel): L.DivIcon {
  const cfg = severity ? SEVERITY_CONFIG[severity] : SEVERITY_CONFIG.LOW;
  return L.divIcon({
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${cfg.colour};border:3px solid white;box-shadow:0 0 8px rgba(0,0,0,0.5), 0 0 16px ${cfg.colour};"></div>`,
  });
}

export function WetlandMap() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<any>(null);
  const layersRef = useRef<Record<string, L.Layer>>({});
  const wetlandBoundsRef = useRef<Record<string, L.LatLngBounds>>({});

  const wetlandCode = useFilterStore(state => state.wetland_code);
  const overlayLayersRef = useRef<Record<string, L.GeoJSON>>({});

  const {
    isSatelliteLayer, isNdviLayer, isNdwiLayer, isLulcLayer, isDemLayer,
    isWetlandBoundaryLayer, isProtectedAreaLayer, isDrainageLayer, isHydroshedsLayer, isAdminLayer,
    selectWetland, overlayLayers,
  } = useUiStore();

  // Use shared React Query cache — no separate fetch loop
  const { data } = useReports();

  // Initialize map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [1.5, 32.5],
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
    });
    mapRef.current = map;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    layersRef.current.osm = L.tileLayer(OSM_URL, { maxZoom: 19, opacity: 0.7 });
    layersRef.current.sat = L.tileLayer(SAT_URL, { maxZoom: 19 });
    layersRef.current.dem = L.tileLayer(DEM_URL, { maxZoom: 19, opacity: 0.6 });
    layersRef.current.ndvi = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 13, opacity: 0.5, className: 'hue-rotate-90 saturate-200 contrast-125' });
    layersRef.current.ndwi = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 13, opacity: 0.5 });
    layersRef.current.lulc = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/World_Navigation_Charts/MapServer/tile/{z}/{y}/{x}', { maxZoom: 10, opacity: 0.5, className: 'hue-rotate-180 saturate-150' });
    layersRef.current.wetland_boundary = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, opacity: 0.8, className: 'hue-rotate-[120deg] saturate-200' });
    layersRef.current.protected_area = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 11, opacity: 0.4, className: 'hue-rotate-[90deg] saturate-150' });
    layersRef.current.drainage = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 13, opacity: 0.7 });
    layersRef.current.hydrosheds = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/World_Navigation_Charts/MapServer/tile/{z}/{y}/{x}', { maxZoom: 10, opacity: 0.5, className: 'hue-rotate-[200deg] contrast-150' });
    layersRef.current.admin = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, opacity: 0.9 });

    // Add default basemap - use satellite for dashboard
    map.addLayer(layersRef.current.sat);

    // Load wetland polygons
    fetch('http://localhost:3000/api/v1/wetlands')
      .then(r => r.json())
      .then(geojson => {
        if (!mapRef.current) return;
        L.geoJSON(geojson, {
          style: {
            color: '#14B8A6', weight: 1.5, opacity: 0.8,
            fillColor: '#14B8A6', fillOpacity: 0.06, dashArray: '4 4',
          },
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.wetland_name;
            const code = feature.properties?.wetland_code;
            if (code) wetlandBoundsRef.current[code] = (layer as L.Path).getBounds();
            if (name) layer.bindTooltip(name, { permanent: false, direction: 'top' });
            layer.on('click', () => {
              if (code) {
                selectWetland(code);
                useFilterStore.getState().setWetlandCode(code);
              }
            });
            layer.on('mouseover', function() { this.setStyle({ fillOpacity: 0.2, weight: 2 }); });
            layer.on('mouseout',  function() { this.setStyle({ fillOpacity: 0.06, weight: 1.5 }); });
          },
        }).addTo(mapRef.current);
      })
      .catch(() => {});

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers whenever React Query data changes
  useEffect(() => {
    if (!mapRef.current || !data?.features) return;
    if (clusterRef.current) mapRef.current.removeLayer(clusterRef.current);

    const cluster = (L as any).markerClusterGroup({
      chunkedLoading: true, maxClusterRadius: 20,
      showCoverageOnHover: true, disableClusteringAtZoom: 10,
    });

    data.features.forEach((feature) => {
      if (feature.geometry?.coordinates) {
        const [lon, lat] = feature.geometry.coordinates;
        const marker = L.marker([lat, lon], { icon: makeMarker(feature.properties.severity) });
        marker.bindPopup(`<div style="font-family:monospace;font-size:12px;padding:8px"><strong>Severity:</strong> ${feature.properties.severity ?? 'UNKNOWN'}</div>`);
        cluster.addLayer(marker);
      }
    });

    cluster.addTo(mapRef.current);
    clusterRef.current = cluster;
  }, [data]);

  // Render uploaded overlay layers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Remove layers that were deleted
    Object.keys(overlayLayersRef.current).forEach(id => {
      if (!overlayLayers.find(l => l.id === id)) {
        map.removeLayer(overlayLayersRef.current[id]);
        delete overlayLayersRef.current[id];
      }
    });

    // Add new layers
    overlayLayers.forEach(l => {
      if (overlayLayersRef.current[l.id]) return;
      const layer = L.geoJSON(l.geojson, {
        style: { color: '#F59E0B', weight: 2, opacity: 0.9, fillOpacity: 0.15 },
        pointToLayer: (_, latlng) => L.circleMarker(latlng, { radius: 6, color: '#F59E0B', fillOpacity: 0.7 }),
        onEachFeature: (feature, layer) => {
          const props = feature.properties;
          if (props && Object.keys(props).length) {
            const html = Object.entries(props).slice(0, 5).map(([k, v]) => `<b>${k}:</b> ${v}`).join('<br/>');
            layer.bindPopup(`<div style="font-family:monospace;font-size:11px">${html}</div>`);
          }
        },
      }).addTo(map);
      overlayLayersRef.current[l.id] = layer;
    });
  }, [overlayLayers]);

  // Fly to wetland when selected
  useEffect(() => {
    if (!wetlandCode || !mapRef.current) return;
    const bounds = wetlandBoundsRef.current[wetlandCode];
    if (bounds && bounds.isValid && bounds.isValid()) {
      mapRef.current.flyToBounds(bounds, { padding: [40, 40], maxZoom: 12, duration: 1.2 });
    }
  }, [wetlandCode]);

  // Sync layer toggles
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const layers = layersRef.current;

    if (isSatelliteLayer) {
      if (map.hasLayer(layers.osm)) map.removeLayer(layers.osm);
      if (map.hasLayer(layers.dem)) map.removeLayer(layers.dem);
      if (!map.hasLayer(layers.sat)) map.addLayer(layers.sat);
    } else if (isDemLayer) {
      if (map.hasLayer(layers.osm)) map.removeLayer(layers.osm);
      if (map.hasLayer(layers.sat)) map.removeLayer(layers.sat);
      if (!map.hasLayer(layers.dem)) map.addLayer(layers.dem);
    } else {
      if (map.hasLayer(layers.sat)) map.removeLayer(layers.sat);
      if (map.hasLayer(layers.dem)) map.removeLayer(layers.dem);
      if (!map.hasLayer(layers.osm)) map.addLayer(layers.osm);
    }

    isNdviLayer ? (!map.hasLayer(layers.ndvi) && map.addLayer(layers.ndvi)) : map.removeLayer(layers.ndvi);
    isNdwiLayer ? (!map.hasLayer(layers.ndwi) && map.addLayer(layers.ndwi)) : map.removeLayer(layers.ndwi);
    isLulcLayer ? (!map.hasLayer(layers.lulc) && map.addLayer(layers.lulc)) : map.removeLayer(layers.lulc);
    isWetlandBoundaryLayer ? (!map.hasLayer(layers.wetland_boundary) && map.addLayer(layers.wetland_boundary)) : map.removeLayer(layers.wetland_boundary);
    isProtectedAreaLayer   ? (!map.hasLayer(layers.protected_area)   && map.addLayer(layers.protected_area))   : map.removeLayer(layers.protected_area);
    isDrainageLayer        ? (!map.hasLayer(layers.drainage)         && map.addLayer(layers.drainage))         : map.removeLayer(layers.drainage);
    isHydroshedsLayer      ? (!map.hasLayer(layers.hydrosheds)       && map.addLayer(layers.hydrosheds))       : map.removeLayer(layers.hydrosheds);
    isAdminLayer           ? (!map.hasLayer(layers.admin)            && map.addLayer(layers.admin))            : map.removeLayer(layers.admin);
  }, [
    isSatelliteLayer, isDemLayer, isNdviLayer, isNdwiLayer, isLulcLayer,
    isWetlandBoundaryLayer, isProtectedAreaLayer, isDrainageLayer, isHydroshedsLayer, isAdminLayer,
  ]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#0D1F35' }} />
  );
}
