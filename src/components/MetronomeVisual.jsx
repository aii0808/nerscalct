import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Droplets, RotateCcw } from 'lucide-react';
import { playDropSound, playClickSound } from '../utils/soundEffects';
import { useTheme } from '../context/ThemeContext';

export const MetronomeVisual = ({ tpm = 20, isMacro = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dropCounter, setDropCounter] = useState(0);
  const [isDropping, setIsDropping] = useState(false);
  const timerRef = useRef(null);
  const { palette } = useTheme();

  // Interval in milliseconds: (60 / TPM) * 1000
  const validTpm = Math.max(1, Math.min(250, Number(tpm) || 20));
  const intervalMs = (60 / validTpm) * 1000;
  const secondsPerDrop = (60 / validTpm).toFixed(2);

  const triggerSingleDrop = () => {
    setIsDropping(true);
    setDropCounter((c) => c + 1);
    if (soundEnabled) {
      playDropSound(isMacro ? 1 : 1.25);
    }
    setTimeout(() => {
      setIsDropping(false);
    }, 450);
  };

  useEffect(() => {
    if (isPlaying) {
      triggerSingleDrop();
      timerRef.current = setInterval(() => {
        triggerSingleDrop();
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, intervalMs, soundEnabled, isMacro]);

  const togglePlay = () => {
    playClickSound();
    setIsPlaying(!isPlaying);
  };

  const resetCounter = () => {
    playClickSound();
    setDropCounter(0);
  };

  return (
    <div className="neu-card rounded-3xl p-5 flex flex-col items-center">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="p-2 rounded-xl shadow-sm"
            style={{ backgroundColor: `${palette.primary}20`, color: palette.primary }}
          >
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Metronom Tetesan Realtime
            </h4>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              {validTpm} TPM &bull; 1 tetes tiap <span className="font-bold" style={{ color: palette.primary }}>{secondsPerDrop}s</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2.5 rounded-xl neu-btn transition-all ${
            soundEnabled ? '' : 'opacity-50'
          }`}
          style={soundEnabled ? { color: palette.primary } : {}}
          title={soundEnabled ? 'Matikan Suara Tetes' : 'Nyalakan Suara Tetes'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
        </button>
      </div>

      {/* Visual Drip Chamber (Bilik Tetesan Infus) */}
      <div className="relative w-44 h-56 bg-[#E6ECF2] dark:bg-[#0A0D11] rounded-2xl shadow-neu-pressed p-2 flex flex-col items-center justify-between overflow-hidden border border-slate-300 dark:border-slate-800">
        
        {/* Top Nozzle (Jarum Tetesan) */}
        <div className="w-full flex flex-col items-center pt-1 z-10">
          <div className="w-10 h-3 bg-slate-300 dark:bg-slate-700 rounded-sm shadow-sm" />
          <div className="w-2.5 h-4 bg-slate-400 dark:bg-slate-600 rounded-b-md" />
          <div className="w-1 h-3 bg-slate-500 dark:bg-slate-500 rounded-b-full" />
        </div>

        {/* Droplet Animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isDropping && (
            <div
              className={`rounded-full shadow-md animate-drop-fall ${
                isMacro ? 'w-3.5 h-4' : 'w-2.5 h-3'
              }`}
              style={{
                background: `linear-gradient(to bottom, ${palette.primary}, ${palette.dark})`,
                borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
              }}
            />
          )}
        </div>

        {/* Bottom Fluid Level with Ripples */}
        <div
          className="w-full relative h-14 rounded-b-xl flex flex-col items-center justify-end pb-2 overflow-hidden"
          style={{
            background: `linear-gradient(to top, ${palette.primary}30, transparent)`,
          }}
        >
          {isDropping && (
            <div
              className="absolute top-2 w-16 h-4 border-2 rounded-full animate-water-ripple"
              style={{ borderColor: palette.primary }}
            />
          )}
          <div
            className="w-full h-7 backdrop-blur-[1px] border-t rounded-b-xl flex items-center justify-center"
            style={{ backgroundColor: `${palette.primary}25`, borderColor: `${palette.primary}40` }}
          >
            <span className="text-[10px] font-black text-slate-900 dark:text-white tracking-wider">
              {dropCounter} TETES TERHITUNG
            </span>
          </div>
        </div>
      </div>

      {/* Controls & Counter */}
      <div className="w-full mt-4 flex items-center justify-between gap-3">
        <button
          onClick={resetCounter}
          className="p-3 rounded-2xl neu-btn text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
          title="Reset Penghitung Tetes"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={togglePlay}
          className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs tracking-wide transition-all ${
            isPlaying
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
              : 'neu-btn-accent shadow-md text-white'
          }`}
          style={!isPlaying ? { background: `linear-gradient(135deg, ${palette.primary}, ${palette.dark})` } : {}}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Jeda Metronom</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Sinkronkan Tetes</span>
            </>
          )}
        </button>
      </div>

      <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 text-center font-bold">
        Cocokkan kecepatan tetesan di bilik infus pasien dengan detak audio & visual di atas.
      </p>
    </div>
  );
};

export default MetronomeVisual;
