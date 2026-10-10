import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
const cartoKey = import.meta.env.VITE_CARTO_API_KEY;
const tileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoKey}`;

// Country borders are ~700KB, so they are loaded lazily after first render.
let shapesPromise;
function loadShapes() {
  shapesPromise ??= Promise.all([import('world-atlas/countries-50m.json'), import('topojson-client')]).then(
    ([{ default: topology }, { feature }]) => {
      const shapes = new Map();
      for (const f of feature(topology, topology.objects.countries).features) shapes.set(f.id, f);
      return shapes;
    },
  );
  return shapesPromise;
}

// markers: [{ country, color, label }]
export default function MapView({ markers, selected, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const [shapes, setShapes] = useState(null);

  useEffect(() => {
    const map = L.map(containerRef.current, { worldCopyJump: true, minZoom: 1 }).setView([25, 10], 1);
    L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 8,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    loadShapes().then(setShapes);
    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    layer.clearLayers();

    for (const { country, color, label } of markers) {
      const isSelected = country.cca2 === selected;
      const shape = shapes?.get(country.ccn3);
      if (shape) {
        L.geoJSON(shape, {
          style: { color: isSelected ? '#111' : color, weight: isSelected ? 2.5 : 1, fillColor: color, fillOpacity: 0.55 },
        })
          .on('click', () => onSelect(country.cca2))
          .bindTooltip(label, { sticky: true })
          .addTo(layer);
      }
      // A dot as well, so tiny countries (Malta, Nauru...) stay visible.
      L.circleMarker(country.latlng, {
        radius: isSelected ? 8 : 6,
        color: '#fff',
        weight: 2,
        fillColor: color,
        fillOpacity: 1,
      })
        .on('click', () => onSelect(country.cca2))
        .bindTooltip(label)
        .addTo(layer);
    }
  }, [markers, shapes, selected, onSelect]);

  // Re-frame only when a country is added, not when the selection changes.
  // Fit to centroids rather than shapes: shapes crossing the antimeridian (Russia, Fiji) break bounds.
  useEffect(() => {
    if (!markers.length) mapRef.current.setView([25, 10], 1);
    else mapRef.current.fitBounds(L.latLngBounds(markers.map((m) => m.country.latlng)).pad(0.3), { maxZoom: 4 });
  }, [markers]);

  // The map container changes size on layout changes (e.g. mobile rotation).
  useEffect(() => {
    const observer = new ResizeObserver(() => mapRef.current?.invalidateSize());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef} className="map" />;
}
