import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom Icon for 1962 Emergency Van
const vanIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063823.png', // Ambulance/Van icon
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

// Helper component to center map dynamically when van moves
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function LiveVanTracker() {
  // Initial coordinates (Simulating Baramati / Pune route for 1962 van)
  const [vanPosition, setVanPosition] = useState([18.1508, 74.5775]);
  const [eta, setEta] = useState('14 mins');
  const [isLive, setIsLive] = useState(false);

  // Simulation effect: simulates the 1962 van moving closer to the farm
  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => {
        setVanPosition(prev => [
          prev[0] + 0.001, // slowly moving latitude
          prev[1] + 0.001  // slowly moving longitude
        ]);
        setEta('8 mins away');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Real browser geolocation function (For Vet side sharing their location)
  const startSharingLocation = () => {
    if (navigator.geolocation) {
      setIsLive(true);
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setVanPosition([latitude, longitude]);
          console.log("Broadcasting live coords:", latitude, longitude);
          // TODO: In production, send this lat/lng via fetch() or WebSocket to your FastAPI backend
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Unable to retrieve live location. Please enable GPS.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="panel" style={{ marginTop: '20px' }}>
      <span className="eyebrow" style={{ background: '#fef2f2', color: '#991b1b' }}>Live Emergency Tracking</span>
      <h2 style={{ fontSize: '24px', marginTop: '6px' }}>1962 Mobile Veterinary Van Tracker</h2>
      <p className="muted">Track the exact real-time location of the dispatched veterinary team heading to your registered farm.</p>

      {/* Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', margin: '16px 0' }}>
        <div>
          <p style={{ margin: 0, fontWeight: '700', color: '#0f172a' }}>Status: {isLive ? '🟢 Live Tracking Active' : '⚪ Waiting for Dispatch'}</p>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Estimated Time of Arrival (ETA): <strong style={{ color: '#0f766e' }}>{eta}</strong></p>
        </div>
        <button 
          onClick={startSharingLocation} 
          className="primary" 
          style={{ background: isLive ? '#16a34a' : '#0f766e' }}
        >
          {isLive ? 'Broadcasting Location...' : '📍 Start Live GPS Share (Vet Mode)'}
        </button>
      </div>

      {/* Map Container */}
      <div style={{ height: '400px', width: '100%', borderRadius: '14px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
        <MapContainer center={vanPosition} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={vanPosition} />
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={vanPosition} icon={vanIcon}>
            <Popup>
              <div>
                <strong style={{ color: '#0f766e' }}>1962 Emergency Van #4</strong>
                <p style={{ margin: '4px 0', fontSize: '13px' }}>Driver: Suresh Kumar (Mobile Vet Unit)</p>
                <small style={{ color: '#64748b' }}>Heading to Pashu Aadhaar Tag: IN-MH-10293</small>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}