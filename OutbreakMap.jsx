import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

// Custom red alert icon for active outbreak clusters
const alertIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function OutbreakMap() {
  // Simulated outbreak clusters with geographic coordinates in Maharashtra
  const outbreakClusters = [
    { id: 1, name: 'Baramati Block Cluster', lat: 18.1508, latLng: [18.1508, 74.5775], risk: 'High (FMD)', radius: 10000 },
    { id: 2, name: 'Satara District Cluster', lat: 17.6805, latLng: [17.6805, 74.0183], risk: 'Critical (Skin Lesion)', radius: 10000 },
    { id: 3, name: 'Akola Surveillance Point', lat: 20.7059, latLng: [20.7059, 77.0219], risk: 'Moderate', radius: 5000 }
  ];

  return (
    <div style={{ height: '450px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
      <MapContainer center={[18.75, 75.7]} zoom={7} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {outbreakClusters.map(cluster => (
          <React.Fragment key={cluster.id}>
            {/* Marker pin for the outbreak cluster */}
            <Marker position={cluster.latLng} icon={alertIcon}>
              <Popup>
                <div>
                  <strong style={{ color: '#991b1b' }}>{cluster.name}</strong>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>Status: <strong>{cluster.risk}</strong></p>
                  <small style={{ color: '#64748b' }}>10 km geo-fence containment active.</small>
                </div>
              </Popup>
            </Marker>
            
            {/* 10 km Buffer Radius Zone (PostGIS simulation) */}
            <Circle 
              center={cluster.latLng} 
              radius={cluster.radius} 
              pathOptions={{ color: '#ef4444', fillColor: '#fee2e2', fillOpacity: 0.4 }} 
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
}