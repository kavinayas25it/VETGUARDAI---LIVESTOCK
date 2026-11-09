import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import PrescriptionReport from './components/PrescriptionReport';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const customStyles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1e293b;
  background: #f8fafc;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-width: 320px;
  background: #f8fafc;
}

button, input, select, textarea { font: inherit; }
button { cursor: pointer; }

.app { min-height: 100vh; display: flex; flex-direction: column; }

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 32px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.brand { display: flex; align-items: center; gap: 12px; }
.brand-icon {
  background: #0f766e;
  color: #ffffff;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-size: 22px;
  box-shadow: 0 4px 12px rgba(15, 118, 110, 0.2);
}
.brand h2 { font-size: 20px; font-weight: 700; margin: 0; color: #0f172a; }
.brand small { font-size: 11px; letter-spacing: 0.8px; color: #64748b; display: block; font-weight: 600; }

.nav {
  display: flex;
  gap: 6px;
  padding: 10px 32px;
  background: #0f766e;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,0.05);
  overflow-x: auto;
}
.nav button {
  border: 0;
  border-radius: 8px;
  padding: 10px 18px;
  background: transparent;
  color: #ccfbf1;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.nav button:hover, .nav .nav-active {
  background: #115e59;
  color: #ffffff;
}

.main { max-width: 1200px; width: 100%; margin: auto; padding: 32px 24px; flex: 1; }
.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  background: linear-gradient(135deg, #f0fdf4 0%, #ccfbf1 100%);
  border: 1px solid #99f6e4;
  border-radius: 20px;
  padding: 40px;
}
.hero-copy { max-width: 640px; }
.eyebrow {
  color: #0f766e;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: inline-block;
  background: #99f6e4;
  padding: 4px 10px;
  border-radius: 6px;
}
h1, h2, h3 { color: #0f172a; margin-top: 0; }
.hero h1 { font-size: 38px; font-weight: 800; line-height: 1.2; }
.hero-copy p { line-height: 1.7; color: #334155; font-size: 16px; }

.hero-art {
  background: #ffffff;
  border-radius: 50%;
  width: 160px;
  height: 160px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 75px;
  box-shadow: 0 10px 25px rgba(15, 118, 110, 0.12);
}

.primary {
  background: #0f766e;
  color: white;
  border: 0;
  border-radius: 10px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(15, 118, 110, 0.25);
  transition: background 0.2s;
}
.primary:hover { background: #115e59; }

.section-heading { margin: 36px 0 16px; display: flex; justify-content: space-between; align-items: center; }
.section-heading h2 { font-size: 22px; font-weight: 700; margin: 0; }

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
@media (max-width: 768px) {
  .grid, .hero { grid-template-columns: 1fr; flex-direction: column; }
  .hero-art { display: none; }
}

.feature {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.feature:hover { border-color: #0f766e; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.04); }
.feature p { color: #64748b; font-size: 14px; line-height: 1.6; }
.feature b { color: #0f766e; font-size: 14px; }
.feature-icon {
  display: inline-grid;
  place-items: center;
  background: #f0fdf4;
  color: #0f766e;
  border-radius: 10px;
  width: 44px;
  height: 44px;
  font-size: 20px;
  margin-bottom: 12px;
}

.panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

form { max-width: 100%; }
label { display: block; font-weight: 600; margin: 16px 0 6px; color: #334155; font-size: 13px; }
input:not([type="checkbox"]), form select, .panel > select, .case select, textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  border-radius: 10px;
  color: #0f172a;
  outline: none;
  font-size: 14px;
}
input:focus, select:focus, textarea:focus { border-color: #0f766e; box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.15); }

.risk-card { padding: 20px 24px; border-radius: 14px; margin-top: 20px; line-height: 1.7; font-size: 14px; }
.rain { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.heat { background: #fff7ed; border: 1px solid #ffedd5; color: #9a3412; }
.big-icon { font-size: 32px; margin-bottom: 8px; display: block; }
.muted { color: #64748b; font-size: 13px; }

.record, .case {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
}
.record { justify-content: flex-start; }
.tag {
  display: inline-block;
  background: #e2e8f0;
  color: #334155;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 700;
}
footer {
  background: #ffffff;
  color: #64748b;
  padding: 24px 32px;
  text-align: center;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
  font-size: 13px;
}
footer p { margin: 0 0 4px; font-weight: 600; color: #334155; }
@media print {
  .no-print { display: none !important; }
}
`;

const translations = {
  en: {
    // General
    title: "PashuSanjeevani",
    subtitle: "MAHARASHTRA LIVESTOCK AI NETWORK",
    emergency: "📞 Emergency 1962 Helpline",
    logout: "Logout",
    langSelect: "Language",
    
    // Login
    portalDesc: "Maharashtra Livestock Surveillance & Triage Portal",
    farmerPortalBtn: "🐄 Farmer Portal",
    vetPortalBtn: "🩺 Doctor / Vet Portal",
    farmerMobileLabel: "Farmer Mobile Number",
    vetMobileLabel: "Doctor Registration ID / Mobile",
    enterMobilePlaceholder: "Enter 10-digit number",
    sendOtpBtn: "Send Secure OTP",
    enterOtpLabel: "Enter 4-Digit Verification Code",
    demoOtpText: "Demo OTP: Use any 4 digits (e.g. 1234)",
    verifyEnterFarmer: "Verify & Enter Farmer Portal",
    verifyEnterVet: "Verify & Enter Doctor Portal",
    backToLoginType: "← Back to Login Type",
    invalidPhone: "Please enter a valid 10-digit mobile number.",
    invalidOtp: "Enter any 4-digit OTP (e.g., 1234)",

    // Navigation Tabs
    overview: "Overview",
    rxStudioTab: "💊 Prescription Studio",
    farmerTab: "Farmer Herd Portal",
    issuedRxTab: "Issued Prescriptions",
    vetTab: "Vet & Outbreak Map",

    // Dashboard Hero & Features
    eyebrow: "Government of Maharashtra Initiative",
    heroTitle: "Protecting Rural Livestock with Edge AI & 1962 Integration",
    heroDesc: "PashuSanjeevani bridges the gap between rural farmers and veterinary experts in Maharashtra, now equipped with specialized livestock prescription modules for Cows, Goats, Sheep, and Poultry.",
    docHeroTitle: "Doctor Clinical Prescription & Dispatch Dashboard",
    docHeroDesc: "Issue real-time digital prescriptions with Cow, Goat, Sheep & Poultry medication selectors, dosages, and format options.",
    startTriage: "Start Prescription Studio →",
    pillarsHeading: "Core Platform Pillars",
    docPillars: "Doctor Operational Tools",
    chatbotTitle: "Veterinary Prescription Management",
    chatbotDesc: "Create tailored prescriptions for Cow, Goat, Sheep, and Poultry with precise symptom selectors, medication categories (Injection, Syrup, Tablet), and instant PDF report generation.",
    exploreTriage: "Open Prescription Studio →",
    ledgerTitle: "Pashu Aadhaar Ledger",
    ledgerDesc: "Track unique ear-tag profiles, vaccination timelines, and download official digital e-prescriptions instantly.",
    docMapTitle: "Farmer Location & Tracking",
    docMapDesc: "Receive precise GPS coordinates notified by farmers and navigate via live map.",
    viewLedger: "View Herd Ledger →",
    viewMap: "View Map →",
    
    // Top Rated Vets
    topRatedVet: "Top Rated Attending Veterinarians & Physicians",
    drOnkar: "State Veterinary Clinic, Pune • Specialization: Ruminant Medicine & Surgery",
    drDeshmukh: "State Mobile Veterinary Unit, Baramati • Specialization: Epidemic Disease Control",

    // Records & Prescriptions
    backToRx: "← Back to Prescriptions List",
    realtimeRecords: "Realtime Medical Records",
    rxRecordsTitle: "Livestock Prescription Records",
    notifyLocation: "📍 Notify My Location to Doctor",
    rxStoredDesc: "All generated prescriptions for Cow, Goat, Sheep, and Poultry are securely stored here.",
    patientLabel: "Patient",
    dateLabel: "Date",
    diseaseLabel: "Disease / Symptoms",
    medicineLabel: "Medicine",
    attendingVetLabel: "Attending Vet",
    viewFullRx: "👁️ View Full Prescription Report & PDF",

    // Maps & Weather
    geoRisk: "Geospatial Risk Intelligence",
    outbreakTitle: "Maharashtra Outbreak Surveillance & Live Van Tracking",
    outbreakDesc: "Live block-level cluster heatmaps and real-time GPS tracking of 1962 mobile veterinary units.",
    farmLocation: "📍 Your Farm Location",
    sharedWith: "Shared with 1962 Veterinary Medical Unit",
    statusLabel: "Status",
    containment: "10 km geo-fence containment active.",
    weatherLoading: "Loading regional weather telemetry...",
    liveTelemetry: "Live District Telemetry & Outbreak Risk Matrix:",
    currentTemp: "Current Temp",
    humidity: "Humidity",
    highHumidityRisk: "High humidity detected: Elevated risk of Foot & Mouth Disease (FMD) spread. Veterinary surveillance units alerted.",
    normalWeather: "Normal seasonal conditions.",

    // Footer
    footerText: "PashuSanjeevani • Maharashtra Livestock Surveillance Network",
    footerSub: "Empowering Rural Dairy Farmers & Veterinary Services with Cow, Goat, Sheep & Poultry Care",
  },
  mr: {
    title: "पशुसंजीवनी",
    subtitle: "महाराष्ट्र पशुधन एआय नेटवर्क",
    emergency: "📞 आपत्कालीन १९६२ हेल्पलाइन",
    logout: "लॉग आउट",
    langSelect: "भाषा",

    portalDesc: "महाराष्ट्र पशुधन पाळत ठेवणे आणि ट्रायज पोर्टल",
    farmerPortalBtn: "🐄 शेतकरी पोर्टल",
    vetPortalBtn: "🩺 डॉक्टर / पशुवैद्यकीय पोर्टल",
    farmerMobileLabel: "शेतकऱ्याचा मोबाईल क्रमांक",
    vetMobileLabel: "डॉक्टर नोंदणी आयडी / मोबाईल",
    enterMobilePlaceholder: "१० अंकी क्रमांक प्रविष्ट करा",
    sendOtpBtn: "सुरक्षित ओटीपी पाठवा",
    enterOtpLabel: "४-अंकी पडताळणी कोड प्रविष्ट करा",
    demoOtpText: "डेमो ओटीपी: कोणतेही ४ अंक वापरा (उदा. १२३४)",
    verifyEnterFarmer: "पडताळणी करा आणि शेतकरी पोर्टलमध्ये प्रवेश करा",
    verifyEnterVet: "पडताळणी करा आणि डॉक्टर पोर्टलमध्ये प्रवेश करा",
    backToLoginType: "← लॉगिन प्रकाराकडे परत जा",
    invalidPhone: "कृपया वैध १०-अंकी मोबाईल क्रमांक प्रविष्ट करा.",
    invalidOtp: "कोणताही ४ अंकी OTP प्रविष्ट करा (उदा. १२३४)",

    overview: "आढावा",
    rxStudioTab: "💊 प्रिस्क्रिप्शन स्टुडिओ",
    farmerTab: "शेतकरी पशू पोर्टल",
    issuedRxTab: "दिलेले प्रिस्क्रिप्शन",
    vetTab: "पशुवैद्यकीय आणि प्रादुर्भाव नकाशा",

    eyebrow: "महाराष्ट्र शासनाचा उपक्रम",
    heroTitle: "एआय आणि १९६२ एकात्मिकरणाद्वारे ग्रामीण पशुधनाचे संरक्षण",
    heroDesc: "पशुसंजीवनी महाराष्ट्रातील शेतकरी आणि पशुवैद्यकांमधील अंतर कमी करते. आता गाय, शेळी, मेंढी आणि पोल्ट्रीसाठी विशेष प्रिस्क्रिप्शन मॉड्यूलसह सज्ज.",
    docHeroTitle: "डॉक्टर क्लिनिकल प्रिस्क्रिप्शन आणि डिस्पॅच डॅशबोर्ड",
    docHeroDesc: "गाय, शेळी, मेंढी आणि पोल्ट्री औषध निवडक आणि डोससह रिअल-टाइम डिजिटल प्रिस्क्रिप्शन जारी करा.",
    startTriage: "प्रिस्क्रिप्शन स्टुडिओ सुरू करा →",
    pillarsHeading: "मुख्य प्लॅटफॉर्म वैशिष्ट्ये",
    docPillars: "डॉक्टर ऑपरेशनल टूल्स",
    chatbotTitle: "पशुवैद्यकीय प्रिस्क्रिप्शन व्यवस्थापन",
    chatbotDesc: "अचूक लक्षणे आणि औषध प्रकारांसह गाय, शेळी, मेंढी आणि पोल्ट्रीसाठी त्वरित प्रिस्क्रिप्शन तयार करा आणि PDF मिळवा.",
    exploreTriage: "प्रिस्क्रिप्शन उघडा →",
    ledgerTitle: "पशू आधार लेजर",
    ledgerDesc: "युनिक इयर-टॅग प्रोफाईल आणि लसीकरण वेळापत्रक ट्रॅक करा.",
    docMapTitle: "शेतकरी स्थान आणि ट्रॅकिंग",
    docMapDesc: "शेतकऱ्यांनी सूचित केलेले अचूक जीपीएस निर्देशांक प्राप्त करा आणि थेट नकाशावर नेव्हिगेट करा.",
    viewLedger: "पशू लेजर पहा →",
    viewMap: "नकाशा पहा →",

    topRatedVet: "सर्वोच्च रेट केलेले पशुवैद्यकीय डॉक्टर",
    drOnkar: "राज्य पशुवैद्यकीय दवाखाना, पुणे • विशेषीकरण: रवंथ करणारे प्राणी आणि शस्त्रक्रिया",
    drDeshmukh: "राज्य फिरते पशुवैद्यकीय पथक, बारामती • विशेषीकरण: रोग नियंत्रण",

    backToRx: "← प्रिस्क्रिप्शन यादीकडे परत जा",
    realtimeRecords: "रिअलटाइम वैद्यकीय रेकॉर्ड",
    rxRecordsTitle: "पशुधन प्रिस्क्रिप्शन रेकॉर्ड",
    notifyLocation: "📍 डॉक्टरांना माझे स्थान कळवा",
    rxStoredDesc: "गाय, शेळी, मेंढी आणि पोल्ट्रीसाठी तयार केलेली सर्व प्रिस्क्रिप्शन्स येथे सुरक्षितपणे जतन केली आहेत.",
    patientLabel: "रुग्ण",
    dateLabel: "तारीख",
    diseaseLabel: "आजार / लक्षणे",
    medicineLabel: "औषध",
    attendingVetLabel: "उपचार करणारे पशुवैद्य",
    viewFullRx: "👁️ संपूर्ण प्रिस्क्रिप्शन रिपोर्ट आणि PDF पहा",

    geoRisk: "भौगोलिक जोखीम बुद्धिमत्ता",
    outbreakTitle: "महाराष्ट्र प्रादुर्भाव पाळत ठेवणे आणि थेट व्हॅन ट्रॅकिंग",
    outbreakDesc: "थेट ब्लॉक-स्तरीय क्लस्टर नकाशे आणि १९६२ फिरत्या पशुवैद्यकीय युनिट्सचे रिअल-टाइम जीपीएस ट्रॅकिंग.",
    farmLocation: "📍 तुमच्या शेताचे स्थान",
    sharedWith: "१९६२ पशुवैद्यकीय वैद्यकीय युनिटसह सामायिक केले",
    statusLabel: "स्थिती",
    containment: "१० किमी जिओ-फेन्स सक्रिय.",
    weatherLoading: "प्रादेशिक हवामान माहिती लोड होत आहे...",
    liveTelemetry: "थेट जिल्हा टेलिमेट्री आणि प्रादुर्भाव धोका मॅट्रिक्स:",
    currentTemp: "सध्याचे तापमान",
    humidity: "आर्द्रता",
    highHumidityRisk: "उच्च आर्द्रता: लाळ्या खुरकत (FMD) रोग पसरण्याचा धोका. पशुवैद्यकीय पथकांना सतर्क केले आहे.",
    normalWeather: "सामान्य हंगामी परिस्थिती.",

    footerText: "पशुसंजीवनी • महाराष्ट्र पशुधन पाळत ठेवणे नेटवर्क",
    footerSub: "गाय, शेळी, मेंढी आणि कुक्कुटपालन सेवेसह ग्रामीण दुग्ध उत्पादक शेतकरी आणि पशुवैद्यकीय सेवांचे सक्षमीकरण"
  },
  hi: {
    title: "पशुसंजीवनी",
    subtitle: "महाराष्ट्र पशुधन एआई नेटवर्क",
    emergency: "📞 आपातकालीन १९६२ हेल्पलाइन",
    logout: "लॉग आउट",
    langSelect: "भाषा",

    portalDesc: "महाराष्ट्र पशुधन निगरानी एवं ट्राइएज पोर्टल",
    farmerPortalBtn: "🐄 किसान पोर्टल",
    vetPortalBtn: "🩺 डॉक्टर / पशुचिकित्सक पोर्टल",
    farmerMobileLabel: "किसान मोबाइल नंबर",
    vetMobileLabel: "डॉक्टर पंजीकरण आईडी / मोबाइल",
    enterMobilePlaceholder: "१० अंकों का नंबर दर्ज करें",
    sendOtpBtn: "सुरक्षित ओटीपी भेजें",
    enterOtpLabel: "४-अंकीय सत्यापन कोड दर्ज करें",
    demoOtpText: "डेमो ओटीपी: कोई भी ४ अंक (जैसे १२३४) का उपयोग करें",
    verifyEnterFarmer: "सत्यापित करें और किसान पोर्टल में प्रवेश करें",
    verifyEnterVet: "सत्यापित करें और डॉक्टर पोर्टल में प्रवेश करें",
    backToLoginType: "← लॉगिन प्रकार पर वापस जाएं",
    invalidPhone: "कृपया एक वैध १०-अंकीय मोबाइल नंबर दर्ज करें।",
    invalidOtp: "कोई भी ४ अंकों का OTP दर्ज करें (उदा. 1234)",

    overview: "अवलोकन",
    rxStudioTab: "💊 प्रिस्क्रिप्शन स्टूडियो",
    farmerTab: "किसान पशु पोर्टल",
    issuedRxTab: "जारी किए गए प्रिस्क्रिप्शन",
    vetTab: "पशुचिकित्सा और प्रकोप मानचित्र",

    eyebrow: "महाराष्ट्र सरकार की पहल",
    heroTitle: "एआई और १९६२ एकीकरण के साथ ग्रामीण पशुधन की सुरक्षा",
    heroDesc: "पशुसंजीवनी महाराष्ट्र में किसानों और पशु चिकित्सकों के बीच की दूरी को कम करती है। अब गाय, बकरी, भेड़ और पोल्ट्री के लिए विशेष प्रिस्क्रिप्शन मॉड्यूल के साथ।",
    docHeroTitle: "डॉक्टर क्लिनिकल प्रिस्क्रिप्शन और डिस्पैच डैशबोर्ड",
    docHeroDesc: "गाय, बकरी, भेड़ और पोल्ट्री दवा चयनकर्ताओं और खुराक के साथ वास्तविक समय के डिजिटल प्रिस्क्रिप्शन जारी करें।",
    startTriage: "प्रिस्क्रिप्शन स्टूडियो शुरू करें →",
    pillarsHeading: "मुख्य प्लेटफॉर्म स्तंभ",
    docPillars: "डॉक्टर ऑपरेशनल टूल्स",
    chatbotTitle: "पशु चिकित्सा प्रिस्क्रिप्शन प्रबंधन",
    chatbotDesc: "सटीक लक्षणों और दवा प्रकारों के साथ गाय, बकरी, भेड़ और पोल्ट्री के लिए त्वरित प्रिस्क्रिप्शन बनाएं और पीडीएफ प्राप्त करें।",
    exploreTriage: "प्रिस्क्रिप्शन खोलें →",
    ledgerTitle: "पशु आधार लेजर",
    ledgerDesc: "अद्वितीय ईयर-टैग प्रोफाइल और टीकाकरण समय सारणी को ट्रैक करें।",
    docMapTitle: "किसान स्थान और ट्रैकिंग",
    docMapDesc: "किसानों द्वारा अधिसूचित सटीक जीपीएस निर्देशांक प्राप्त करें और लाइव मानचित्र के माध्यम से नेविगेट करें।",
    viewLedger: "पशु लेजर देखें →",
    viewMap: "मानचित्र देखें →",

    topRatedVet: "शीर्ष रेटेड पशु चिकित्सक",
    drOnkar: "राज्य पशु चिकित्सा क्लिनिक, पुणे • विशेषज्ञता: जुगाली करने वाले पशु और सर्जरी",
    drDeshmukh: "राज्य मोबाइल पशु चिकित्सा इकाई, बारामती • विशेषज्ञता: रोग नियंत्रण",

    backToRx: "← प्रिस्क्रिप्शन सूची पर वापस जाएं",
    realtimeRecords: "वास्तविक समय मेडिकल रिकॉर्ड",
    rxRecordsTitle: "पशुधन प्रिस्क्रिप्शन रिकॉर्ड",
    notifyLocation: "📍 डॉक्टर को मेरा स्थान सूचित करें",
    rxStoredDesc: "गाय, बकरी, भेड़ और पोल्ट्री के लिए उत्पन्न सभी प्रिस्क्रिप्शन सुरक्षित रूप से यहाँ संग्रहीत हैं।",
    patientLabel: "रोगी",
    dateLabel: "तारीख",
    diseaseLabel: "बीमारी / लक्षण",
    medicineLabel: "दवा",
    attendingVetLabel: "उपस्थित पशु चिकित्सक",
    viewFullRx: "👁️ पूर्ण प्रिस्क्रिप्शन रिपोर्ट और पीडीएफ देखें",

    geoRisk: "भौगोलिक जोखिम बुद्धिमत्ता",
    outbreakTitle: "महाराष्ट्र प्रकोप निगरानी और लाइव वैन ट्रैकिंग",
    outbreakDesc: "लाइव ब्लॉक-स्तरीय क्लस्टर हीटमैप और १९६२ मोबाइल पशु चिकित्सा इकाइयों की रीयल-टाइम जीपीएस ट्रैकिंग।",
    farmLocation: "📍 आपके खेत का स्थान",
    sharedWith: "१९६२ पशु चिकित्सा मेडिकल इकाई के साथ साझा किया गया",
    statusLabel: "स्थिति",
    containment: "१० किमी जियो-फेंस नियंत्रण सक्रिय।",
    weatherLoading: "क्षेत्रीय मौसम टेलीमेट्री लोड हो रहा है...",
    liveTelemetry: "लाइव जिला टेलीमेट्री और प्रकोप जोखिम मैट्रिक्स:",
    currentTemp: "वर्तमान तापमान",
    humidity: "नमी",
    highHumidityRisk: "उच्च आर्द्रता: खुरपका-मुंहपका (FMD) रोग फैलने का जोखिम। पशु चिकित्सा निगरानी इकाइयों को सतर्क कर दिया गया है।",
    normalWeather: "सामान्य मौसमी स्थिति।",

    footerText: "पशुसंजीवनी • महाराष्ट्र पशुधन निगरानी नेटवर्क",
    footerSub: "गाय, बकरी, भेड़ और पोल्ट्री देखभाल के साथ ग्रामीण डेयरी किसानों और पशु चिकित्सा सेवाओं का सशक्तिकरण"
  }
};

function LanguageSelector({ lang, setLang }) {
  return (
    <select 
      value={lang} 
      onChange={(e) => setLang(e.target.value)}
      style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
    >
      <option value="en">English</option>
      <option value="mr">मराठी (Marathi)</option>
      <option value="hi">हिंदी (Hindi)</option>
    </select>
  );
}

function Login({ lang, setLang }) {
  const t = translations[lang];
  const [role, setRole] = useState('farmer');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      alert(t.invalidPhone);
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length === 4) {
      if (role === 'farmer') {
        navigate('/farmer-dashboard');
      } else {
        navigate('/vet-dashboard');
      }
    } else {
      alert(t.invalidOtp);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/40 flex flex-col p-6">
      <style>{customStyles}</style>
      
      <div className="absolute top-6 right-6 z-10">
        <LanguageSelector lang={lang} setLang={setLang} />
      </div>

      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-600 to-emerald-500"></div>

          <div className="text-center mb-8">
            <div className="inline-grid place-items-center bg-teal-50 text-teal-700 w-12 h-12 rounded-xl mb-3 shadow-sm mx-auto text-xl font-bold">
              🐄
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t.title}</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">{t.portalDesc}</p>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setRole('farmer'); setOtpSent(false); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                role === 'farmer' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.farmerPortalBtn}
            </button>
            <button
              type="button"
              onClick={() => { setRole('vet'); setOtpSent(false); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                role === 'vet' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.vetPortalBtn}
            </button>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  {role === 'farmer' ? t.farmerMobileLabel : t.vetMobileLabel}
                </label>
                <div className="flex shadow-sm rounded-lg">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-600 text-sm font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength="10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.enterMobilePlaceholder}
                    className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-r-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="primary w-full py-3 font-semibold rounded-lg shadow-md">
                {t.sendOtpBtn}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  {t.enterOtpLabel}
                </label>
                <input
                  type="text"
                  maxLength="4"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="• • • •"
                  className="w-full text-center tracking-widest text-xl font-bold px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-slate-50"
                  required
                />
                <p className="text-xs text-slate-400 mt-1.5 text-center">{t.demoOtpText}</p>
              </div>
              <button type="submit" className="primary w-full py-3 font-semibold rounded-lg shadow-md">
                {role === 'farmer' ? t.verifyEnterFarmer : t.verifyEnterVet}
              </button>
              <button 
                type="button" 
                onClick={() => setOtpSent(false)} 
                className="w-full text-xs text-slate-500 hover:text-teal-700 mt-2 text-center font-medium block"
              >
                {t.backToLoginType}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function OutbreakMap({ farmerLocation, lang }) {
  const t = translations[lang];
  const outbreakClusters = [
    { id: 1, name: 'Baramati Block Cluster', latLng: [18.1508, 74.5775], risk: 'High (FMD)', radius: 10000 },
    { id: 2, name: 'Satara District Cluster', latLng: [17.6805, 74.0183], risk: 'Critical (Skin Lesion)', radius: 10000 },
    { id: 3, name: 'Akola Surveillance Point', latLng: [20.7059, 77.0219], risk: 'Moderate', radius: 5000 }
  ];

  return (
    <div style={{ height: '420px', width: '100%', borderRadius: '14px', overflow: 'hidden', border: '1px solid #cbd5e1', margin: '20px 0' }}>
      <MapContainer center={farmerLocation || [18.75, 75.7]} zoom={7} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {farmerLocation && (
          <Marker position={farmerLocation}>
            <Popup>
              <div>
                <strong style={{ color: '#0f766e' }}>{t.farmLocation}</strong>
                <p style={{ margin: '4px 0', fontSize: '13px' }}>{t.sharedWith}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {outbreakClusters.map(cluster => (
          <React.Fragment key={cluster.id}>
            <Marker position={cluster.latLng}>
              <Popup>
                <div>
                  <strong style={{ color: '#991b1b' }}>{cluster.name}</strong>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{t.statusLabel}: <strong>{cluster.risk}</strong></p>
                  <small style={{ color: '#64748b' }}>{t.containment}</small>
                </div>
              </Popup>
            </Marker>
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

function DistrictWeatherWidget({ lang }) {
  const t = translations[lang];
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=18.52&longitude=73.85&current=temperature_2m,relative_humidity_2m,precipitation')
      .then(res => res.json())
      .then(data => setWeather(data.current))
      .catch(() => {});
  }, []);

  if (!weather) return <p className="muted">{t.weatherLoading}</p>;

  const isHighHumidity = weather.relative_humidity_2m > 75;

  return (
    <div className={`risk-card ${isHighHumidity ? 'rain' : 'heat'}`}>
      <span className="big-icon">{isHighHumidity ? '🌧️' : '☀️'}</span>
      <strong>{t.liveTelemetry}</strong>
      <p style={{ margin: '8px 0 0' }}>
        {t.currentTemp}: <strong>{weather.temperature_2m}°C</strong> | {t.humidity}: <strong>{weather.relative_humidity_2m}%</strong>
        <br/><br/>
        {isHighHumidity ? t.highHumidityRisk : t.normalWeather}
      </p>
    </div>
  );
}

function Dashboard({ portalType = 'farmer', lang, setLang }) {
  const [activeTab, setActiveTab] = useState('home');
  const t = translations[lang];

  const [farmerLocation, setFarmerLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Not Shared');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

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
        symptoms: ["Bacterial infections"],
        disease: "Fever and Mastitis",
        medicineType: "Injection",
        medicineName: "Oxytetracycline",
        dosage: "10 ml",
        frequency: "Once daily",
        duration: "5 days",
        instructions: "Isolate animal immediately. Administer slow IV/IM.",
        vet_name: "Dr. Onkar Bhave",
        clinic: "State Veterinary Hospital, Pune"
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
        alert('📍 Location shared successfully!');
      },
      (err) => alert('Unable to retrieve location: ' + err.message)
    );
  };

  return (
    <div className="app">
      <style>{customStyles}</style>

      {/* Top Header */}
      <header className="topbar no-print">
        <div className="brand">
          <div className="brand-icon">🐄</div>
          <div>
            <h2>{t.title} ({portalType === 'vet' ? t.vetPortalBtn.replace('🩺 ', '') : t.farmerPortalBtn.replace('🐄 ', '')})</h2>
            <small>{t.subtitle}</small>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <LanguageSelector lang={lang} setLang={setLang} />

          <button 
            onClick={() => window.location.href='tel:1962'} 
            className="primary"
            style={{ padding: '10px 16px', fontSize: '13px' }}>
            {t.emergency}
          </button>
          
          <button 
            onClick={() => window.location.href='/'} 
            style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '10px', fontWeight: '600', fontSize: '13px' }}>
            {t.logout}
          </button>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="nav no-print">
        <button className={activeTab === 'home' ? 'nav-active' : ''} onClick={() => setActiveTab('home')}>{t.overview}</button>
        <button className={activeTab === 'prescription_studio' ? 'nav-active' : ''} onClick={() => setActiveTab('prescription_studio')}>{t.rxStudioTab}</button>
        <button className={activeTab === 'farmer' ? 'nav-active' : ''} onClick={() => setActiveTab('farmer')}>{portalType === 'vet' ? t.issuedRxTab : t.farmerTab}</button>
        <button className={activeTab === 'vet' ? 'nav-active' : ''} onClick={() => setActiveTab('vet')}>{t.vetTab}</button>
      </nav>

      {/* Main Container */}
      <main className="main">
        {activeTab === 'home' && (
          <div>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">{t.eyebrow}</span>
                <h1>{portalType === 'vet' ? t.docHeroTitle : t.heroTitle}</h1>
                <p>{portalType === 'vet' ? t.docHeroDesc : t.heroDesc}</p>
                <div style={{ marginTop: '24px' }}>
                  <button className="primary" onClick={() => setActiveTab('prescription_studio')}>{t.startTriage}</button>
                </div>
              </div>
              <div className="hero-art">🐃</div>
            </section>

            <div className="section-heading">
              <h2>{portalType === 'vet' ? t.docPillars : t.pillarsHeading}</h2>
            </div>

            <div className="grid">
              <div className="feature" onClick={() => setActiveTab('prescription_studio')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">📝</div>
                <h3>{t.chatbotTitle}</h3>
                <p>{t.chatbotDesc}</p>
                <b>{t.exploreTriage}</b>
              </div>
              <div className="feature" onClick={() => setActiveTab('farmer')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">📍</div>
                <h3>{portalType === 'vet' ? t.docMapTitle : t.ledgerTitle}</h3>
                <p>{portalType === 'vet' ? t.docMapDesc : t.ledgerDesc}</p>
                <b>{portalType === 'vet' ? t.viewMap : t.viewLedger}</b>
              </div>
            </div>

            <div style={{ marginTop: '50px' }}>
              <div className="section-heading">
                <h2>{t.topRatedVet}</h2>
              </div>
              <div className="grid">
                <div className="feature">
                  <div className="feature-icon">🩺</div>
                  <h3>Dr. Onkar Bhave (M.V.Sc.)</h3>
                  <p>{t.drOnkar}</p>
                  <b>⭐ 4.9 / 5.0 (124 Patient Reviews)</b>
                </div>
                <div className="feature">
                  <div className="feature-icon">🩺</div>
                  <h3>Dr. A. K. Deshmukh (M.V.Sc.)</h3>
                  <p>{t.drDeshmukh}</p>
                  <b>⭐ 4.8 / 5.0 (98 Patient Reviews)</b>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRESCRIPTION STUDIO TAB */}
        {activeTab === 'prescription_studio' && (
          <PrescriptionReport 
            onSavePrescription={(newRx) => {
              setPrescriptions(prev => [newRx, ...prev]);
              setActiveTab('farmer');
            }}
          />
        )}

        {/* FARMER PORTAL / ISSUED PRESCRIPTIONS VIEW */}
        {activeTab === 'farmer' && (
          <div className="panel">
            {selectedPrescription ? (
              <div>
                <button onClick={() => setSelectedPrescription(null)} className="primary" style={{ marginBottom: '16px', background: '#64748b' }}>
                  {t.backToRx}
                </button>
                <PrescriptionReport prescriptionData={selectedPrescription} />
              </div>
            ) : (
              <>
                <span className="eyebrow" style={{ background: '#f0fdf4', color: '#0f766e' }}>{t.realtimeRecords}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '6px' }}>
                  <h1 style={{ fontSize: '28px', margin: 0 }}>{t.rxRecordsTitle} ({prescriptions.length})</h1>
                  {portalType === 'farmer' && (
                    <button className="primary" onClick={handleShareFarmerLocation}>
                      {t.notifyLocation} ({locationStatus})
                    </button>
                  )}
                </div>
                <p className="muted">{t.rxStoredDesc}</p>

                <div style={{ marginTop: '20px' }}>
                  {prescriptions.map((rx) => (
                    <div className="record" key={rx.id || rx.prescriptionNo} style={{ flexDirection: 'column', alignItems: 'flex-start', background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
                        <div>
                          <span className="tag" style={{ background: '#0f766e', color: '#fff' }}>
                            {rx.animalType || 'Cow'} • {rx.animal_tag || rx.prescriptionNo}
                          </span>
                          <strong style={{ marginLeft: '10px', color: '#0f766e' }}>{t.patientLabel}: {rx.farmer_name}</strong>
                        </div>
                        <span className="muted">{t.dateLabel}: {rx.date || 'Today'}</span>
                      </div>
                      <div style={{ margin: '12px 0', width: '100%' }}>
                        <p style={{ margin: '4px 0' }}><strong>{t.diseaseLabel}:</strong> {rx.disease || rx.diagnosis}</p>
                        <p style={{ margin: '4px 0' }}><strong>{t.medicineLabel} ({rx.medicineType || 'General'}):</strong> {rx.medicineName} — {rx.dosage} ({rx.frequency}, {rx.duration})</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#0f766e' }}><strong>{t.attendingVetLabel}:</strong> {rx.vet_name || 'Dr. Onkar Bhave'}</p>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button 
                          onClick={() => setSelectedPrescription(rx)} 
                          className="primary" 
                          style={{ background: '#0284c7' }}
                        >
                          {t.viewFullRx}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* VET & OUTTRACK MAP TAB */}
        {activeTab === 'vet' && (
          <div className="panel">
            <span className="eyebrow" style={{ background: '#f0fdf4', color: '#0f766e' }}>{t.geoRisk}</span>
            <h1 style={{ fontSize: '28px', marginTop: '6px' }}>{t.outbreakTitle}</h1>
            <p className="muted">{t.outbreakDesc}</p>

            <OutbreakMap farmerLocation={farmerLocation} lang={lang} />
            <DistrictWeatherWidget lang={lang} />
          </div>
        )}
      </main>

      <footer className="no-print">
        <p>{t.footerText}</p>
        <small>{t.footerSub}</small>
      </footer>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('en'); // Global Language State

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login lang={lang} setLang={setLang} />} />
        <Route path="/farmer-dashboard" element={<Dashboard portalType="farmer" lang={lang} setLang={setLang} />} />
        <Route path="/vet-dashboard" element={<Dashboard portalType="vet" lang={lang} setLang={setLang} />} />
      </Routes>
    </Router>
  );
}