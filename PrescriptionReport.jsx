import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, 
  FileText, 
  Download, 
  PlusCircle, 
  Search, 
  ShieldCheck, 
  Activity, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  AlertTriangle,
  HeartPulse,
  Pill,
  Syringe,
  Calendar,
  User,
  Tag
} from 'lucide-react';

export default function PrescriptionReport({ prescriptionData, onBack, onSavePrescription }) {
  // Comprehensive Formulated Database mapped by Animal & Medicine Type
  const animalFormulationDatabase = {
    Cow: {
      symptoms: [
        'Bacterial infections & Mastitis', 
        'Worm infestations', 
        'Pain, Fever & Inflammation', 
        'Calcium deficiency (Milk Fever)', 
        'Nutritional & Vitamin Support', 
        'Rumen & Digestive Issues',
        'FMD / HS / BQ Prevention'
      ],
      formulations: {
        'Injection': [
          'Oxytetracycline',
          'Amoxicillin',
          'Ceftiofur',
          'Meloxicam',
          'Calcium borogluconate',
          'Vitamin B12'
        ],
        'Syrup / Oral': [
          'Oral electrolytes',
          'Liquid calcium supplements',
          'Vitamin B complex',
          'Propylene glycol',
          'Oral probiotics',
          'Oral rehydration solution'
        ],
        'Bolus / Tablet': [
          'Albendazole bolus',
          'Fenbendazole bolus',
          'Mineral bolus',
          'Rumen stimulant bolus',
          'Oral mineral tablets',
          'Veterinary antacid bolus'
        ],
        'Topical / Other': [
          'Povidone iodine',
          'Chlorhexidine solution',
          'Ivermectin pour-on',
          'Wound spray',
          'Mastitis intramammary preparations',
          'Udder ointment'
        ]
      }
    },
    Goat: {
      symptoms: [
        'Bacterial infections & Pneumonia', 
        'Internal Worms & Parasites', 
        'Coccidiosis (Scouring/Diarrhea)', 
        'Pain & Joint Inflammation', 
        'Mineral/Calcium Deficiency', 
        'PPR / ET / Goat Pox Prevention'
      ],
      formulations: {
        'Injection': [
          'Oxytetracycline',
          'Amoxicillin',
          'Ivermectin',
          'Meloxicam',
          'Vitamin B12',
          'Penicillin'
        ],
        'Syrup / Oral': [
          'Oral electrolytes',
          'Vitamin B complex',
          'Oral calcium supplements',
          'Probiotics',
          'Oral rehydration solution',
          'Nutritional supplements'
        ],
        'Bolus / Tablet': [
          'Fenbendazole bolus',
          'Albendazole bolus',
          'Mineral tablets',
          'Deworming tablets',
          'Mineral bolus',
          'Veterinary oral tablets'
        ],
        'Topical / Other': [
          'Povidone iodine',
          'Wound spray',
          'Antiseptic cream',
          'Tick and mite treatment',
          'Antifungal cream',
          'External parasite spray'
        ]
      }
    },
    Sheep: {
      symptoms: [
        'Respiratory & Bacterial Infections', 
        'Gastrointestinal Worms', 
        'Coccidiosis / Enterotoxemia', 
        'Foot rot & Inflammation', 
        'Selenium / Cobalt Deficiency', 
        'Sheep Pox / FMD Prevention'
      ],
      formulations: {
        'Injection': [
          'Oxytetracycline',
          'Amoxicillin',
          'Meloxicam',
          'Ivermectin',
          'Vitamin B12',
          'Penicillin'
        ],
        'Syrup / Oral': [
          'Oral electrolytes',
          'Vitamin B complex',
          'Oral probiotics',
          'Oral rehydration solution',
          'Nutritional supplements',
          'Oral mineral supplements'
        ],
        'Bolus / Tablet': [
          'Albendazole bolus',
          'Fenbendazole bolus',
          'Mineral tablets',
          'Deworming tablets',
          'Mineral bolus',
          'Veterinary oral tablets'
        ],
        'Topical / Other': [
          'Povidone iodine',
          'Wound spray',
          'Antiseptic solution',
          'Tick treatment',
          'Sheep skin treatment',
          'Fly repellent spray'
        ]
      }
    },
    Poultry: {
      symptoms: [
        'Respiratory & Airsacculitis', 
        'Coccidiosis Outbreak (Bloody Droppings)', 
        'Helminthiasis (Worms)', 
        'Dehydration & Heat Stress', 
        'Vitamin Deficiency & Poor Growth', 
        'Newcastle Disease / IBD / Fowl Pox Risk'
      ],
      formulations: {
        'Injection': [
          'Vitamin B12',
          'Oxytetracycline',
          'Veterinary vaccines',
          'Veterinary fluids'
        ],
        'Syrup / Oral': [
          'Amprolium solution',
          'Electrolyte solution',
          'Doxycycline solution',
          'Tylosin solution',
          'Probiotic solution',
          'Vitamin AD3E solution',
          'Vitamin supplements'
        ],
        'Bolus / Tablet': [
          'Individual veterinary tablets (rare)',
          'Individual oral tablets (rare)'
        ],
        'Topical / Other': [
          'Newcastle vaccine spray',
          'Iodine disinfectant',
          'Wound spray',
          'Fowl pox vaccine',
          'Eye-drop vaccines',
          'Foot disinfectant'
        ]
      }
    }
  };

  // State Management
  const [selectedAnimal, setSelectedAnimal] = useState('Cow');
  const [medicineType, setMedicineType] = useState('Injection');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  
  // Form fields
  const [patientTagId, setPatientTagId] = useState('TAG-8842');
  const [patientName, setPatientName] = useState('Lakshmi (Dairy Cow)');
  const [ownerName, setOwnerName] = useState('Murugan Farmer');
  
  // Dynamically fetched available medicines for selected Animal + Formulation
  const availableMedicines = animalFormulationDatabase[selectedAnimal]?.formulations[medicineType] || [];
  const [medicineName, setMedicineName] = useState(availableMedicines[0] || '');

  const [dosage, setDosage] = useState('15 ml (Deep IM / As directed)');
  const [frequency, setFrequency] = useState('Once daily (Every 24 hours)');
  const [duration, setDuration] = useState('3 Days');
  const [vetNotes, setVetNotes] = useState('Ensure adequate clean water. Observe withholding period before milk/meat consumption.');
  const [vetName, setVetName] = useState('Dr. K. R. Ramanathan, B.V.Sc.');

  // Saved Prescriptions List with Initial Sample Data
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'VET-2026-001',
      animal: 'Cow',
      tagId: 'TAG-4012',
      patientName: 'Ganga (Jersey)',
      ownerName: 'Selvam Dairy Farm',
      symptoms: ['Bacterial infections & Mastitis'],
      medicineType: 'Injection',
      medicineName: 'Ceftiofur',
      dosage: '10 ml',
      frequency: 'Twice daily',
      duration: '5 Days',
      date: '2026-11-09',
      vetNotes: 'Withhold milk for 4 days. Monitor temperature.',
      vetName: 'Dr. Ramesh, MVSc'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(prescriptionData ? 'preview' : 'form');

  // Handle animal change
  const handleAnimalChange = (animal) => {
    setSelectedAnimal(animal);
    setSelectedSymptoms([]);
    const firstFormulationMedicines = animalFormulationDatabase[animal]?.formulations[medicineType] || [];
    setMedicineName(firstFormulationMedicines[0] || '');
    
    if (animal === 'Cow') {
      setPatientName('Ganga Dairy Cow');
      setPatientTagId('TAG-5512');
    } else if (animal === 'Goat') {
      setPatientName('Kallai Doe');
      setPatientTagId('TAG-7714');
    } else if (animal === 'Sheep') {
      setPatientName('Nilagiri Ram');
      setPatientTagId('TAG-3320');
    } else {
      setPatientName('Broiler Flock Batch A');
      setPatientTagId('FLOCK-POUL-01');
    }
  };

  // Handle Formulation Change
  const handleFormulationChange = (formulation) => {
    setMedicineType(formulation);
    const medsInFormulation = animalFormulationDatabase[selectedAnimal]?.formulations[formulation] || [];
    setMedicineName(medsInFormulation[0] || '');
  };

  // Toggle symptom selection
  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Handle Submit Prescription
  const handleSubmit = (e) => {
    e.preventDefault();
    const newRx = {
      id: `VET-2026-${String(prescriptions.length + 1).padStart(3, '0')}`,
      animal: selectedAnimal,
      tagId: patientTagId || 'TAG-UNKNOWN',
      patientName: patientName || 'Unnamed Patient',
      ownerName: ownerName || 'General Farm',
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['General Clinical Care'],
      medicineType,
      medicineName: medicineName || 'Standard Treatment',
      dosage: dosage || 'As directed',
      frequency: frequency || 'Daily',
      duration: duration || '3 Days',
      date: new Date().toISOString().split('T')[0],
      vetNotes: vetNotes || 'Follow standard veterinary withdrawal guidelines.',
      vetName: vetName || 'Staff Veterinarian'
    };

    if (onSavePrescription) {
      onSavePrescription(newRx);
    } else {
      setPrescriptions([newRx, ...prescriptions]);
      setActiveTab('list');
    }
  };

  // Delete Prescription
  const handleDelete = (id) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  // If component mounted with direct prescription view prop
  if (prescriptionData) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 p-6 shadow-2xl text-slate-100">
        <div className="flex justify-between items-center pb-4 border-b border-slate-700 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Official Veterinary Prescription Report</h2>
            <p className="text-xs text-slate-400">Verified Treatment Record</p>
          </div>
          {onBack && (
            <button onClick={onBack} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold">
              ← Back
            </button>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">SMART LIVESTOCK CARE SYSTEM</h3>
              <p className="text-[11px] text-slate-400">Clinical Prescription & Treatment Record</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/50">
                {prescriptionData.id || 'RX-001'}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">{prescriptionData.date || new Date().toISOString().split('T')[0]}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/40 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Patient ID / Tag</span>
              <strong className="text-white">{prescriptionData.tagId || prescriptionData.animal_tag}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Patient / Herd Name</span>
              <strong className="text-white">{prescriptionData.patientName || prescriptionData.farmer_name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Animal Category</span>
              <span className="text-emerald-400 font-semibold">{prescriptionData.animal || prescriptionData.animalType}</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
            <div className="flex justify-between items-center bg-emerald-950/30 p-3 rounded-lg border border-emerald-900/40">
              <div>
                <span className="text-[10px] uppercase text-emerald-400 font-bold block">Prescribed Medicine ({prescriptionData.medicineType})</span>
                <strong className="text-white text-sm">{prescriptionData.medicineName}</strong>
              </div>
              <span className="text-right font-mono text-emerald-300 bg-emerald-900/40 px-2.5 py-1 rounded text-xs">
                {prescriptionData.dosage}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-800/50 p-2.5 rounded">
                <span className="text-[10px] text-slate-400 block">Frequency</span>
                <strong className="text-white text-xs">{prescriptionData.frequency}</strong>
              </div>
              <div className="bg-slate-800/50 p-2.5 rounded">
                <span className="text-[10px] text-slate-400 block">Duration</span>
                <strong className="text-white text-xs">{prescriptionData.duration}</strong>
              </div>
            </div>
          </div>

          {prescriptionData.vetNotes && (
            <div className="text-xs bg-amber-950/20 border border-amber-800/30 p-3 rounded-lg text-amber-200/90">
              <strong className="text-amber-400 block text-[10px] uppercase mb-0.5">Clinical Instructions & Withdrawal Warning:</strong>
              {prescriptionData.vetNotes}
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Attending Vet: {prescriptionData.vetName || 'Dr. Onkar Bhave'}</span>
            <span className="text-emerald-400 font-medium">Verified Official Rx</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => alert(`Downloading official PDF prescription report.`)}
            className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow"
          >
            <Download className="w-4 h-4" /> Download PDF Report
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-slate-700 hover:bg-slate-600 text-white p-2.5 rounded-xl text-xs transition-all flex items-center justify-center border border-slate-600 shadow"
            title="Print Rx"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    );
  }

  const currentSymptoms = animalFormulationDatabase[selectedAnimal]?.symptoms || [];

  return (
    <div className="bg-slate-900 text-slate-100 font-sans pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Notice banner */}
        <div className="mb-6 bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-200/90 leading-relaxed">
            <span className="font-semibold text-emerald-300">Veterinary Clinical Safety Notice:</span> Drug dosage, route of administration, and withdrawal periods (milk/meat/eggs) must be verified by a licensed veterinarian.
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'form' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              <PlusCircle className="w-4 h-4" /> Prescription Form Builder
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'list' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              <FileText className="w-4 h-4" /> Saved Records ({prescriptions.length})
            </button>
          </div>
        </div>

        {activeTab === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Form Builder (7 cols) */}
            <div className="lg:col-span-7 bg-slate-800/70 backdrop-blur-md rounded-2xl border border-slate-700/60 p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-3">
                <HeartPulse className="w-5 h-5 text-emerald-400" /> 4-Step Formulation Prescription Builder
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Animal Category Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    1. Select Animal <span className="text-emerald-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Cow', 'Goat', 'Sheep', 'Poultry'].map((animal) => (
                      <button
                        type="button"
                        key={animal}
                        onClick={() => handleAnimalChange(animal)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${selectedAnimal === animal ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500' : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600'}`}
                      >
                        <span className="font-bold text-sm flex items-center justify-between">
                          {animal}
                          {selectedAnimal === animal && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {animal === 'Cow' && 'Bovine / Dairy'}
                          {animal === 'Goat' && 'Caprine / Meat-Milk'}
                          {animal === 'Sheep' && 'Ovine / Wool-Meat'}
                          {animal === 'Poultry' && 'Layers / Broilers'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Medicine Formulation Type Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    2. Type of Medicine Formulation <span className="text-emerald-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Injection', 'Syrup / Oral', 'Bolus / Tablet', 'Topical / Other'].map((formulation) => {
                      const isSelected = medicineType === formulation;
                      return (
                        <button
                          type="button"
                          key={formulation}
                          onClick={() => handleFormulationChange(formulation)}
                          className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${isSelected ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
                        >
                          <span className="truncate">{formulation}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Select Specific Medicine from Filtered Dropdown */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-emerald-400" /> 3. Select Medicine ({selectedAnimal} - {medicineType}) <span className="text-emerald-400">*</span>
                  </label>
                  <select 
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                    required
                  >
                    {availableMedicines.map((med, idx) => (
                      <option key={idx} value={med}>
                        {med}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Symptoms / Clinical Condition Checklist */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Diagnosed Symptoms & Conditions (Multiple)
                  </label>
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 max-h-36 overflow-y-auto space-y-2">
                    {currentSymptoms.map((symptom) => {
                      const isChecked = selectedSymptoms.includes(symptom);
                      return (
                        <label 
                          key={symptom} 
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isChecked ? 'bg-emerald-900/30 border border-emerald-700/50' : 'hover:bg-slate-800'}`}
                        >
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSymptomToggle(symptom)}
                            className="w-4 h-4 text-emerald-600 rounded bg-slate-800 border-slate-600 focus:ring-emerald-500"
                          />
                          <span className="text-xs text-slate-200 font-medium">{symptom}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Patient & Prescription Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-700">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" /> Patient / Ear-Tag ID
                    </label>
                    <input 
                      type="text" 
                      value={patientTagId}
                      onChange={(e) => setPatientTagId(e.target.value)}
                      placeholder="e.g., TAG-8842" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" /> Animal Name / Herd Info
                    </label>
                    <input 
                      type="text" 
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g., Lakshmi (Dairy Cow)" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Owner / Farm Name
                    </label>
                    <input 
                      type="text" 
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g., Kumar Livestock Farm" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Dosage (Admin Amount)
                    </label>
                    <input 
                      type="text" 
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      placeholder="e.g., 15 ml or 1 Bolus" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Frequency (Times to be used)
                    </label>
                    <input 
                      type="text" 
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      placeholder="e.g., Twice daily" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Duration of Treatment
                    </label>
                    <input 
                      type="text" 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 3 Days" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Veterinarian Clinical Notes & Withdrawal Warnings
                  </label>
                  <textarea 
                    rows="2"
                    value={vetNotes}
                    onChange={(e) => setVetNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" /> Generate & Save Prescription
                </button>

              </form>
            </div>

            {/* Right Column: Live Prescription Preview Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 p-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">Live Prescription Report Card</h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-semibold rounded-full border border-emerald-500/30">
                    {selectedAnimal}
                  </span>
                </div>

                {/* Printable Rx Card Layout */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4 shadow-inner text-slate-300">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-bold text-white text-base">SMART LIVESTOCK CARE SYSTEM</h4>
                      <p className="text-[11px] text-slate-400">Veterinary Clinical Prescription & Treatment Record</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/50">
                        RX-PREVIEW
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date().toISOString().split('T')[0]}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/40 p-3 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Patient ID / Tag</span>
                      <strong className="text-white">{patientTagId}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Patient / Herd Name</span>
                      <strong className="text-white">{patientName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Owner / Farm</span>
                      <span className="text-white">{ownerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Animal Category</span>
                      <span className="text-emerald-400 font-semibold">{selectedAnimal}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/40">
                      <div>
                        <span className="text-[10px] uppercase text-emerald-400 font-bold block">Prescribed Medicine ({medicineType})</span>
                        <strong className="text-white text-sm">{medicineName || 'Select Medicine'}</strong>
                      </div>
                      <span className="text-right font-mono text-emerald-300 bg-emerald-900/40 px-2 py-1 rounded text-xs">
                        {dosage}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-slate-800/50 p-2 rounded">
                        <span className="text-[10px] text-slate-400 block">Frequency</span>
                        <strong className="text-white text-xs">{frequency}</strong>
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded">
                        <span className="text-[10px] text-slate-400 block">Duration</span>
                        <strong className="text-white text-xs">{duration}</strong>
                      </div>
                    </div>
                  </div>

                  {vetNotes && (
                    <div className="text-xs bg-amber-950/20 border border-amber-800/30 p-2.5 rounded-lg text-amber-200/90">
                      <strong className="text-amber-400 block text-[10px] uppercase mb-0.5">Clinical Instructions & Withdrawal:</strong>
                      {vetNotes}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span>Vet: {vetName}</span>
                    <span className="text-emerald-400 font-medium">Verified Rx</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => alert(`Simulating PDF download for ${patientName} prescription report.`)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-600 shadow"
                  >
                    <Download className="w-4 h-4 text-emerald-400" /> Download PDF Report
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="bg-slate-700 hover:bg-slate-600 text-white p-2.5 rounded-xl text-xs transition-all flex items-center justify-center border border-slate-600 shadow"
                    title="Print Rx"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Records List View */
          <div className="bg-slate-800/70 backdrop-blur-md rounded-2xl border border-slate-700/60 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Saved Prescription Records</h2>
                <p className="text-xs text-slate-400">Total {prescriptions.length} prescriptions logged</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Rx ID / Date</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Medicine & Formulation</th>
                    <th className="px-4 py-3">Dosage & Duration</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {prescriptions.map((rx) => (
                    <tr key={rx.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 font-mono">
                        <span className="text-emerald-400 font-semibold block">{rx.id}</span>
                        <span className="text-[11px] text-slate-400">{rx.date}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {rx.patientName}
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-full border border-emerald-800">
                            {rx.animal}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{rx.tagId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{rx.medicineName}</div>
                        <span className="text-xs text-slate-400">{rx.medicineType}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-semibold text-slate-200">{rx.dosage}</div>
                        <span className="text-[11px] text-slate-400">{rx.frequency} ({rx.duration})</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => alert(`Downloading official PDF for ${rx.id}`)}
                            className="p-1.5 bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(rx.id)}
                            className="p-1.5 bg-slate-700 hover:bg-rose-600 text-slate-200 hover:text-white rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}