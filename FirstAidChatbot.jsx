import React, { useState, useEffect, useRef } from 'react';
import { Stethoscope, Send, Mic, Image as ImageIcon, X } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const API_KEY = "AIzaSyAQ.Ab8RN6KwkLf_ZM1FIKdEDtkT3vIW_iMS0n89i1nCMbhGNMlRbg"; // Replace with your actual key
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function to convert image file for Gemini
async function fileToGenerativePart(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: { data: base64Data, mimeType: file.type },
      });
    };
    reader.readAsDataURL(file);
  });
}

export default function FirstAidChatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Namaskar! I am your Pashu-Rakshak AI. Describe symptoms, upload an image of the disease, or use the mic to speak in English, Hindi, or Marathi.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // States for Voice, Image, and Language
  const [isListening, setIsListening] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [language, setLanguage] = useState("hi-IN"); // en-US, hi-IN, mr-IN

  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Voice input logic
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input. Please try Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language; 
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      console.error("Speech error", event);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImagePreview(URL.createObjectURL(file));
      setSelectedImageFile(file);
    }
  };

  // Real-time Gemini AI Chat Logic
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImageFile) return;
    
    const userText = inputMessage;
    const userImagePreview = selectedImagePreview;
    const userImageFile = selectedImageFile;
    
    setMessages(prev => [...prev, { sender: 'user', text: userText, image: userImagePreview }]);
    setInputMessage('');
    setSelectedImagePreview(null);
    setSelectedImageFile(null);
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const languageMap = { "en-US": "English", "hi-IN": "Hindi", "mr-IN": "Marathi" };
      const systemInstruction = `You are Pashu-Rakshak, an expert veterinary AI assistant in India. 
      Analyze the symptoms or the image provided. Provide specific, practical, and safe first-aid advice for that specific disease. 
      If symptoms are severe, always advise calling 1962. Keep answers structured and concise. 
      IMPORTANT: You MUST respond in ${languageMap[language]}.`;
      
      const fullPrompt = `${systemInstruction}\n\nUser Input: ${userText}`;
      let aiResponseText = "";

      if (userImageFile) {
        const imagePart = await fileToGenerativePart(userImageFile);
        const result = await model.generateContent([fullPrompt, imagePart]);
        aiResponseText = result.response.text();
      } else {
        const result = await model.generateContent(fullPrompt);
        aiResponseText = result.response.text();
      }

      setMessages(prev => [...prev, { sender: 'bot', text: aiResponseText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: `Error details: ${error.message || JSON.stringify(error)}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px] overflow-hidden">
      <div className="p-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
        <span className="font-semibold text-emerald-900 flex items-center gap-2 text-sm">
          <Stethoscope className="w-4 h-4 text-emerald-600" /> First-Aid Assistant
        </span>
        <select 
          className="text-emerald-900 bg-white border border-emerald-200 rounded px-2 py-1 text-xs outline-none font-medium cursor-pointer" 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en-US">English</option>
          <option value="hi-IN">हिंदी (Hindi)</option>
          <option value="mr-IN">मराठी (Marathi)</option>
        </select>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm flex flex-col bg-slate-50">
        {messages.map((m, idx) => (
          <div key={idx} className={`p-3 rounded-xl max-w-[85%] shadow-sm ${m.sender === 'user' ? 'ml-auto bg-emerald-600 text-white rounded-br-none' : 'mr-auto bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
            {m.image && <img src={m.image} alt="Upload" className="w-full max-w-[200px] h-auto rounded mb-2 border border-emerald-500/30 object-cover" />}
            <div style={{ whiteSpace: "pre-wrap" }} className="leading-relaxed">{m.text}</div>
          </div>
        ))}
        {isTyping && (
           <div className="mr-auto bg-white text-slate-500 border border-slate-200 p-3 rounded-xl rounded-bl-none max-w-[85%] text-xs shadow-sm flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             <span className="ml-1 text-emerald-700 font-medium">Analyzing symptoms...</span>
           </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {selectedImagePreview && (
        <div className="p-2 border-t bg-slate-100 flex items-center gap-3">
          <div className="relative">
            <img src={selectedImagePreview} alt="Upload preview" className="h-12 w-12 object-cover rounded border border-slate-300 shadow-sm" />
            <button 
              onClick={() => {setSelectedImagePreview(null); setSelectedImageFile(null);}} 
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <span className="text-xs text-slate-500 font-medium">Image attached</span>
        </div>
      )}

      <div className="p-3 border-t border-slate-200 flex gap-2 items-end bg-white">
        <label className="p-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors" title="Upload Image">
          <ImageIcon className="w-5 h-5" />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
        
        <button 
          onClick={startListening} 
          className={`p-2.5 rounded-lg transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} 
          title="Speak Symptoms"
        >
          <Mic className="w-5 h-5" />
        </button>
        
        <textarea
          placeholder="Describe symptoms, add image, or speak..."
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-emerald-600 resize-none overflow-hidden max-h-24 min-h-[44px]"
          rows={1}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isTyping}
        />
        
        <button 
          onClick={handleSendMessage} 
          disabled={isTyping || (!inputMessage.trim() && !selectedImageFile)} 
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white p-2.5 rounded-lg transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}