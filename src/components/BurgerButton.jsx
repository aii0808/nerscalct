import React from 'react';
import { playClickSound } from '../utils/soundEffects';

export const BurgerButton = ({ isOpen, onClick, className = '' }) => {
  const handleClick = (e) => {
    playClickSound();
    onClick?.(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isOpen ? 'Tutup Menu' : 'Buka Menu'}
      className={`relative w-10 h-10 rounded-2xl neu-btn flex flex-col items-center justify-center gap-1.5 p-2.5 transition-all duration-300 group ${className}`}
    >
      {/* Top Line */}
      <span
        className={`w-5 h-0.5 rounded-full bg-neu-text dark:bg-neu-darkText transition-all duration-300 ease-in-out transform ${
          isOpen ? 'rotate-45 translate-y-2' : ''
        }`}
      />
      {/* Middle Line */}
      <span
        className={`w-5 h-0.5 rounded-full bg-neu-text dark:bg-neu-darkText transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-0 -translate-x-2' : 'opacity-100'
        }`}
      />
      {/* Bottom Line */}
      <span
        className={`w-5 h-0.5 rounded-full bg-neu-text dark:bg-neu-darkText transition-all duration-300 ease-in-out transform ${
          isOpen ? '-rotate-45 -translate-y-2' : ''
        }`}
      />
    </button>
  );
};

export default BurgerButton;
