import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface LoginPromptOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  message?: string;
}

const LoginPromptOverlay: React.FC<LoginPromptOverlayProps> = ({ 
  isOpen, 
  onClose, 
  onLogin, 
  message = "Login or sign up first" 
}) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only close if clicking the background, not the oval
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
      onClick={handleBackgroundClick}
    >
      {/* Back Arrow */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 p-3 text-white hover:text-gray-300 transition-colors duration-200 z-10"
        aria-label="Go back to home"
      >
        <ArrowLeft className="w-8 h-8" />
      </button>

      {/* Purple Oval with Login Text */}
      <div
        onClick={onLogin}
        className="relative cursor-pointer transform hover:scale-105 transition-all duration-300"
      >
        {/* Purple Oval Background */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full px-12 py-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="text-center">
            <p className="text-white text-xl md:text-2xl font-semibold">
              {message}
            </p>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-30 blur-xl -z-10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoginPromptOverlay;