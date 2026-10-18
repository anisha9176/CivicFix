import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function MapView({ complaints = [], onSelectLocation, selectedLat, selectedLng, isPickerMode = false, height = "350px" }) {
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);
  const markersRef = useRef([]);

  // Fix default marker icon issue in Leaflet with bundlers
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Map if not already created
    if (!leafletInstance.current) {
      const initialLat = selectedLat || 12.9716;
      const initialLng = selectedLng || 77.5946;

      const map = L.map(mapRef.current).setView([initialLat, initialLng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      leafletInstance.current = map;

      // Handle map click in location picker mode
      if (isPickerMode && onSelectLocation) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onSelectLocation(lat, lng);
        });
      }
    }

    const map = leafletInstance.current;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Mode 1: Location Picker Single Marker
    if (isPickerMode && selectedLat && selectedLng) {
      const pinIcon = L.divIcon({
        className: 'custom-pin-icon',
        html: `<div style="background: #6366f1; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 12px rgba(99,102,241,0.8);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([selectedLat, selectedLng], { icon: pinIcon })
        .addTo(map)
        .bindPopup('<b>Selected Issue Location</b><br>Click map to change location pin.')
        .openPopup();

      markersRef.current.push(marker);
      map.panTo([selectedLat, selectedLng]);
    }

    // Mode 2: Multi-complaint Display Markers
    if (!isPickerMode && complaints.length > 0) {
      complaints.forEach((c) => {
        if (!c.lat || !c.lng) return;

        let color = '#6366f1';
        if (c.priority === 'Urgent' || c.priority === 'High') color = '#f43f5e';
        if (c.status === 'Resolved') color = '#10b981';
        if (c.status === 'In Progress') color = '#f59e0b';

        const customMarker = L.divIcon({
          className: 'civic-marker',
          html: `<div style="background: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.5);"></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const popupContent = `
          <div style="font-family: sans-serif; color: #111; max-width: 200px;">
            <strong style="color: #4f46e5;">${c.id}</strong> - ${c.category}<br/>
            <strong>${c.title}</strong><br/>
            <small style="color: #666;">${c.locationName}</small><br/>
            <span style="display:inline-block; margin-top:4px; padding:2px 6px; background:${color}; color:white; border-radius:10px; font-size:10px; font-weight:bold;">${c.status}</span>
          </div>
        `;

        const marker = L.marker([c.lat, c.lng], { icon: customMarker })
          .addTo(map)
          .bindPopup(popupContent);

        markersRef.current.push(marker);
      });
    }

  }, [complaints, selectedLat, selectedLng, isPickerMode]);

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {isPickerMode && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 999,
          background: 'rgba(15, 23, 42, 0.9)',
          color: '#f3f4f6',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          💡 Click anywhere on the map to pin exact civic issue location
        </div>
      )}
    </div>
  );
}
