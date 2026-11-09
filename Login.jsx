import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [role, setRole] = useState('farmer'); // 'farmer' or 'vet'
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '1234' || otp.length === 4) {
      // Route based on selected role
      if (role === 'farmer') {
        navigate('/farmer-dashboard');
      } else {
        navigate('/vet-dashboard');
      }
    } else {
      alert('Enter any 4-digit OTP (e.g., 1234)');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            SIH 2026 | Project Rakshak
          </span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Livestock Health Portal</h2>
          <p className="text-sm text-gray-500 mt-1">Early Detection & Triage System (Maharashtra)</p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              role === 'farmer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🐄 Farmer / Owner
          </button>
          <button
            type="button"
            onClick={() => setRole('vet')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              role === 'vet' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🩺 Veterinary Official
          </button>
        </div>

        {/* Login Form */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {role === 'farmer' ? 'Mobile Number' : 'Official Vet ID / Mobile'}
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength="10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit number"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md text-sm"
            >
              Get OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter 4-Digit OTP sent to +91 {phone}
              </label>
              <input
                type="text"
                maxLength="4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1 2 3 4"
                className="w-full text-center tracking-widest text-lg px-3 py-2 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1 text-center">Use any 4 digits (e.g., 1234)</p>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md text-sm"
            >
              Verify & Login
            </button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-xs text-gray-500 hover:text-emerald-600 mt-2 text-center block"
            >
              ← Change Mobile Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}