import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import PrescriptionReport from './PrescriptionReport';
import EmergencyReportForm from './EmergencyForm'; // Assuming you have this saved here

// 1. Import the global language hook
import { useLanguage } from '../context/LanguageContext';

// --- HELPER COMPONENTS (Map & Weather) ---

function OutbreakMap({ farmerLocation }) {
  const outbreakClusters = [
    { id: 1, name: 'Baramati Block Cluster', latLng: [18.1508, 74.5775], risk: 'High (FMD)', radius: 10000 },
    { id: 2, name: 'Satara District Cluster', latLng: [17.6805, 74.0183], risk: 'Critical (Skin Lesion)', radius: 10000 },
    { id: 3, name: 'Akola Surveillance Point', latLng: [20.7059, 77.0219], risk: 'Moderate', radius: 5000 }
  ];

  return (
    <div style={{ height: '420px', width: '100%', borderRadius: '14px', overflow: 'hidden', border: '1px solid #cbd5e1', margin: '20px 0' }}>
      <MapContainer center={farmerLocation || [18.75, 75.7]} zoom={7} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {farmerLocation && (
          <Marker position={farmerLocation}>
            <Popup><strong>📍 Your Farm Location</strong></Popup>
          </Marker>
        )}
        {outbreakClusters.map(cluster => (
          <React.Fragment key={cluster.id}>
            <Marker position={cluster.latLng}>
              <Popup>
                <div>
                  <strong style={{ color: '#991b1b' }}>{cluster.name}</strong>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>Status: <strong>{cluster.risk}</strong></p>
                </div>
              </Popup>
            </Marker>
            <Circle center={cluster.latLng} radius={cluster.radius} pathOptions={{ color: '#ef4444', fillColor: '#fee2e2', fillOpacity: 0.4 }} />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
}

function DistrictWeatherWidget() {
  const { t } = useLanguage(); // Use translation for loading text
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=18.52&longitude=73.85&current=temperature_2m,relative_humidity_2m,precipitation')
      .then(res => res.json())
      .then(data => setWeather(data.current))
      .catch(() => {});
  }, []);

  if (!weather) return <p className="muted">{t.loadingWeather}</p>;

  const isHighHumidity = weather.relative_humidity_2m > 75;

  return (
    <div className={`risk-card ${isHighHumidity ? 'rain' : 'heat'}`}>
      <span className="big-icon">{isHighHumidity ? '🌧️' : '☀️'}</span>
      <strong>Live District Telemetry & Outbreak Risk Matrix:</strong>
      <p style={{ margin: '8px 0 0' }}>
        Current Temp: <strong>{weather.temperature_2m}°C</strong> | Humidity: <strong>{weather.relative_humidity_2m}%</strong>
        {isHighHumidity ? ' • High humidity detected: Elevated risk of Foot & Mouth Disease (FMD) spread. Veterinary surveillance units alerted.' : ' • Normal seasonal conditions.'}
      </p>
    </div>
  );
}


// --- MAIN DASHBOARD COMPONENT ---

export default function Dashboard({ portalType = 'farmer' }) {
  // 2. Extract language state and translations (t) from Context
  const { lang, changeLanguage, t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('home');
  const [farmerLocation, setFarmerLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Not Shared');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Load Prescriptions from LocalStorage (Simulated Database)
  const [prescriptions, setPrescriptions] = useState(() => {
    const saved = localStorage.getItem('pashu_prescriptions');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        date: "November 9, 2026",
        prescriptionNo: "ID: COW001 - DEMO PATIENT (Cow) / 4 Y",
        farmer_name: "Ramesh Patil",
        animal_tag: "COW001",
        breed: "Gir Cow (4 Y)",
        animalType: "Cow",
        disease: "Fever and Mastitis",
        medicineType: "Injection",
        medicineName: "Oxytetracycline",
        dosage: "10 ml",
        frequency: "Once daily",
        duration: "5 days",
        vet_name: "Dr. Onkar Bhave",
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('pashu_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  const handleShareFarmerLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setFarmerLocation(coords);
        setLocationStatus(`Shared (${coords[0].toFixed(2)}, ${coords[1].toFixed(2)})`);
        alert('📍 Your farm location has been successfully notified!');
      },
      (err) => alert('Unable to retrieve location: ' + err.message)
    );
  };

  return (
    <div className="app">
      {/* 3. TOP HEADER WITH LANGUAGE DROPDOWN */}
      <header className="topbar no-print">
        <div className="brand">
          <div className="brand-icon">🐄</div>
          <div>
            <h2>{t.title} ({portalType === 'vet' ? 'Doctor / Vet Portal' : 'Farmer Portal'})</h2>
            <small>{t.subtitle}</small>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          
          {/* THE GLOBAL LANGUAGE DROPDOWN */}
          <select 
            value={lang} 
            onChange={(e) => changeLanguage(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            <option value="en">English</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="hi">हिंदी (Hindi)</option>
          </select>

          <button onClick={() => window.location.href='tel:1962'} className="primary" style={{ padding: '10px 16px', fontSize: '13px' }}>
            {t.emergency}
          </button>
          
          <button onClick={() => window.location.href='/'} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '10px', fontWeight: '600', fontSize: '13px' }}>
            {t.logout}
          </button>
        </div>
      </header>

      {/* 4. NAVIGATION BAR */}
      <nav className="nav no-print">
        <button className={activeTab === 'home' ? 'nav-active' : ''} onClick={() => setActiveTab('home')}>{t.overview}</button>
        <button className={activeTab === 'prescription_studio' ? 'nav-active' : ''} onClick={() => setActiveTab('prescription_studio')}>{t.triageTab}</button>
        <button className={activeTab === 'farmer' ? 'nav-active' : ''} onClick={() => setActiveTab('farmer')}>{portalType === 'vet' ? t.farmerTabIssued : t.farmerTab}</button>
        <button className={activeTab === 'vet' ? 'nav-active' : ''} onClick={() => setActiveTab('vet')}>{t.vetTab}</button>
      </nav>

      <main className="main">
        {/* HOMEPAGE VIEW */}
        {activeTab === 'home' && (
          <div>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">{t.eyebrow}</span>
                <h1>{portalType === 'vet' ? t.heroTitleVet : t.heroTitleFarmer}</h1>
                <p>{portalType === 'vet' ? t.heroDescVet : t.heroDescFarmer}</p>
                <div style={{ marginTop: '24px' }}>
                  <button className="primary" onClick={() => setActiveTab('prescription_studio')}>{t.startTriage}</button>
                </div>
              </div>
              <div className="hero-art">🐃</div>
            </section>

            <div className="section-heading">
              <h2>{portalType === 'vet' ? t.pillarsHeadingVet : t.pillarsHeadingFarmer}</h2>
            </div>

            <div className="grid">
              <div className="feature" onClick={() => setActiveTab('prescription_studio')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">📝</div>
                <h3>{t.chatbotTitle}</h3>
                <p>{t.chatbotDesc}</p>
                <b>{t.exploreTriage}</b>
              </div>
              <div className="feature" onClick={() => setActiveTab(portalType === 'vet' ? 'vet' : 'farmer')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">📍</div>
                <h3>{portalType === 'vet' ? t.ledgerTitleVet : t.ledgerTitleFarmer}</h3>
                <p>{portalType === 'vet' ? t.ledgerDescVet : t.ledgerDescFarmer}</p>
                <b>{portalType === 'vet' ? t.viewLedgerVet : t.viewLedgerFarmer}</b>
              </div>
            </div>
          </div>
        )}

        {/* PRESCRIPTION STUDIO VIEW */}
        {activeTab === 'prescription_studio' && (
          <PrescriptionReport 
            onSavePrescription={(newRx) => {
              setPrescriptions(prev => [newRx, ...prev]);
              setActiveTab('farmer');
            }}
          />
        )}

        {/* RECORDS & ISSUED PRESCRIPTIONS VIEW */}
        {activeTab === 'farmer' && (
          <div className="panel">
            {selectedPrescription ? (
              <div>
                <button onClick={() => setSelectedPrescription(null)} className="primary" style={{ marginBottom: '16px', background: '#64748b' }}>
                  {t.backToList}
                </button>
                <PrescriptionReport prescriptionData={selectedPrescription} />
              </div>
            ) : (
              <>
                <span className="eyebrow" style={{ background: '#f0fdf4', color: '#0f766e' }}>Realtime Medical Records</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '6px' }}>
                  <h1 style={{ fontSize: '28px', margin: 0 }}>{t.recordTitle} ({prescriptions.length})</h1>
                  {portalType === 'farmer' && (
                    <button className="primary" onClick={handleShareFarmerLocation}>
                      {t.notifyLocation} ({locationStatus})
                    </button>
                  )}
                </div>
                <p className="muted">{t.recordDesc}</p>

                <div style={{ marginTop: '20px' }}>
                  {prescriptions.map((rx) => (
                    <div className="record" key={rx.id || rx.prescriptionNo} style={{ flexDirection: 'column', alignItems: 'flex-start', background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
                        <div>
                          <span className="tag" style={{ background: '#0f766e', color: '#fff' }}>{rx.animalType || 'Cow'} • {rx.animal_tag || rx.prescriptionNo}</span>
                          <strong style={{ marginLeft: '10px', color: '#0f766e' }}>Patient: {rx.farmer_name || rx.patientName}</strong>
                        </div>
                        <span className="muted">Date: {rx.date || 'Today'}</span>
                      </div>
                      <div style={{ margin: '12px 0', width: '100%' }}>
                        <p style={{ margin: '4px 0' }}><strong>{t.disease}</strong> {rx.disease || rx.diagnosis}</p>
                        
                        {/* Safe rendering of medicine list or single medicine */}
                        {rx.medicines ? (
                          <p style={{ margin: '4px 0' }}><strong>{t.medicine}:</strong> {rx.medicines.length} Prescribed</p>
                        ) : (
                          <p style={{ margin: '4px 0' }}><strong>{t.medicine} ({rx.medicineType || 'General'}):</strong> {rx.medicineName} — {rx.dosage} ({rx.duration})</p>
                        )}

                        <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#0f766e' }}><strong>{t.attendingVet}</strong> {rx.vet_name || 'Dr. Onkar Bhave'}</p>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={() => setSelectedPrescription(rx)} className="primary" style={{ background: '#0284c7' }}>
                          {t.viewFullReport}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* OUTBREAK MAP VIEW */}
        {activeTab === 'vet' && (
          <div className="panel">
            <span className="eyebrow" style={{ background: '#f0fdf4', color: '#0f766e' }}>{t.geoRisk}</span>
            <h1 style={{ fontSize: '28px', marginTop: '6px' }}>{t.outbreakTitle}</h1>
            <p className="muted">{t.outbreakDesc}</p>

            <OutbreakMap farmerLocation={farmerLocation} />
            <DistrictWeatherWidget />
          </div>
        )}
      </main>
    </div>
  );
}