import React, { useEffect, useState } from 'react';
import { Activity, HeartPulse, ArrowRight } from 'lucide-react';
import { playMonitorBeep } from '../utils/soundEffects';

export const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Subtle single monitor beep on start
    playMonitorBeep();

    // Fast, lightweight timer-based progress that reaches 100% in ~1.15s
    const startTime = performance.now();
    const duration = 1150; // 1.15 seconds

    let rafId;
    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);

      if (elapsed < duration) {
        rafId = requestAnimationFrame(updateProgress);
      } else {
        // Automatically transition right away
        const finishTimeout = setTimeout(() => {
          onFinish();
        }, 120);
        return () => clearTimeout(finishTimeout);
      }
    };

    rafId = requestAnimationFrame(updateProgress);

    // Safety fallback timer: never block longer than 1.4s
    const safetyTimer = setTimeout(() => {
      onFinish();
    }, 1400);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(safetyTimer);
    };
  }, [onFinish]);

  // Clean, realistic 3-cycle clinical Lead II ECG path in 600x140 coordinate space
  const ecgPath =
    "M0,70 L30,70 C38,70 42,60 48,60 C54,60 58,70 66,70 L82,70 L88,78 L96,16 L104,96 L110,70 L132,70 C142,70 148,56 160,56 C172,56 178,70 188,70 L200,70 " +
    "L230,70 C238,70 242,60 248,60 C254,60 258,70 266,70 L282,70 L288,78 L296,16 L304,96 L310,70 L332,70 C342,70 348,56 360,56 C372,56 378,70 388,70 L400,70 " +
    "L430,70 C438,70 442,60 448,60 C454,60 458,70 466,70 L482,70 L488,78 L496,16 L504,96 L510,70 L532,70 C542,70 548,56 560,56 C572,56 578,70 588,70 L600,70";

  return (
    <div
      onClick={onFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between py-6 px-4 bg-[#05080C] text-white select-none cursor-pointer"
    >
      {/* Top Bar: Hospital Monitor Telemetry */}
      <div className="w-full max-w-lg flex items-center justify-between text-xs font-mono px-3.5 py-2 rounded-2xl bg-[#0A0E14] border border-emerald-500/20 shadow-sm">
        <div className="flex items-center gap-2 text-[#00FF88]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-ping" />
          <span className="font-black tracking-widest text-[11px]">ECG LEAD II &bull; 25mm/s</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">HR:</span>
            <span className="text-[#00FF88] text-sm font-black font-mono">75</span>
            <span className="text-[10px] text-slate-400">BPM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">SpO2:</span>
            <span className="text-sky-400 text-sm font-black font-mono">99%</span>
          </div>
        </div>
      </div>

      {/* Main Center Oscilloscope Monitor */}
      <div className="w-full max-w-lg flex flex-col items-center my-auto">
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[#00FF88] text-xs font-black mb-2 shadow-sm">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>SISTEM KLINIS PERAWAT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-1.5 font-sans">
            Ners<span className="text-[#00FF88]">Calc</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-1">
            Asisten &amp; Kalkulator Klinis S.Kep
          </p>
        </div>

        {/* Lightweight Hardware-Accelerated SVG Monitor Screen */}
        <div className="w-full rounded-2xl overflow-hidden border-2 border-emerald-500/30 bg-[#04070B] relative shadow-lg">
          <div className="h-40 sm:h-48 w-full relative flex items-center justify-center">
            {/* Ultra-lightweight Static CSS Background Grid (Zero Draw Calls) */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(0, 255, 136, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 136, 0.15) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            {/* Baseline Guide */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-emerald-500/20" />

            {/* Hardware-Accelerated ECG Wave SVG */}
            <svg
              viewBox="0 0 600 140"
              className="w-full h-full relative z-10 block"
              preserveAspectRatio="none"
            >
              {/* Ghost Guide Wave */}
              <path
                d={ecgPath}
                fill="none"
                stroke="rgba(0, 255, 136, 0.12)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Active Sweeping ECG Wave (GPU Composited) */}
              <path
                d={ecgPath}
                fill="none"
                stroke="#00FF88"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 900,
                  strokeDashoffset: 900 - (progress / 100) * 900,
                  transition: 'stroke-dashoffset 80ms linear',
                }}
              />
            </svg>
          </div>

          {/* Real-time Rhythm Tag */}
          <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-lg border border-emerald-500/30 text-[10px] font-mono text-[#00FF88]">
            <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
            <span>NSR (Irama Sinus Normal)</span>
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="w-full mt-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-[#00FF88]">
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>Memuat Sistem NersCalc...</span>
            </span>
            <span className="font-black text-white">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#00FF88] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Instant Skip Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFinish();
          }}
          className="mt-5 flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-black tracking-wide text-white transition-all active:scale-95"
        >
          <span>Masuk Langsung</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#00FF88]" />
        </button>
      </div>

      {/* Footer Copyright: ARI SUANDI PUTRA IS THE SOFTWARE DEVELOPER */}
      <div className="text-center font-mono text-[11px] text-slate-400 font-bold">
        &copy; Ari Suandi Putra &bull; Software Developer
      </div>
    </div>
  );
};

export default SplashScreen;
