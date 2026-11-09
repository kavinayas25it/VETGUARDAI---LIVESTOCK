import React, { createContext, useState, useContext } from 'react';

// 1. Create the Dictionary for the whole app
const translations = {
  en: {
    // Header & Tabs
    portalTitle: "PashuSanjeevani",
    emergencyBtn: "📞 Emergency 1962",
    tabOverview: "Overview",
    tabTriage: "AI Triage & First-Aid",
    tabPrescription: "Live Prescription Studio",
    
    // Emergency Form
    farmerName: "Farmer Full Name:",
    village: "Village / District:",
    submitEmergency: "🚀 Submit Emergency Form & Notify 1962 Unit",
    
    // Prescription Studio
    generateRx: "🚀 Generate & Publish Clinical Prescription"
  },
  mr: {
    // Header & Tabs
    portalTitle: "पशुसंजीवनी",
    emergencyBtn: "📞 आपत्कालीन १९६२",
    tabOverview: "आढावा",
    tabTriage: "एआय ट्राइएज",
    tabPrescription: "थेट प्रिस्क्रिप्शन स्टुडिओ",
    
    // Emergency Form
    farmerName: "शेतकऱ्याचे पूर्ण नाव:",
    village: "गाव / जिल्हा:",
    submitEmergency: "🚀 आपत्कालीन फॉर्म सबमिट करा",

    // Prescription Studio
    generateRx: "🚀 क्लिनिकल प्रिस्क्रिप्शन तयार करा"
  },
  hi: {
    // Header & Tabs
    portalTitle: "पशुसंजीवनी",
    emergencyBtn: "📞 आपातकालीन १९६२",
    tabOverview: "अवलोकन",
    tabTriage: "एआई ट्राइएज",
    tabPrescription: "लाइव प्रिस्क्रिप्शन स्टूडियो",
    
    // Emergency Form
    farmerName: "किसान का पूरा नाम:",
    village: "गांव / जिला:",
    submitEmergency: "🚀 आपातकालीन फॉर्म जमा करें",

    // Prescription Studio
    generateRx: "🚀 क्लिनिकल प्रिस्क्रिप्शन उत्पन्न करें"
  }
};

// 2. Create the Context
const LanguageContext = createContext();

// 3. Create the Provider Wrapper
export const LanguageProvider = ({ children }) => {
  // Check if user previously selected a language, otherwise default to English
  const [lang, setLang] = useState(localStorage.getItem('app_lang') || 'en');

  // Function to change language and save to local storage
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = translations[lang] || translations['en'];

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 4. Custom Hook for easy access in any file
export const useLanguage = () => useContext(LanguageContext);