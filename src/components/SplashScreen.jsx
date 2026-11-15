import React, { useEffect, useRef, useState } from 'react';
import { Activity, HeartPulse, ArrowRight } from 'lucide-react';
import { playMonitorBeep } from '../utils/soundEffects';

export const SplashScreen = ({ onFinish }) => {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [heartRate, setHeartRate] = useState(75);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // High DPI retina setup
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = (canvas.width = (rect.width || 600) * dpr);
    const height = (canvas.height = (rect.height || 220) * dpr);
    ctx.scale(dpr, dpr);

    const cssWidth = width / dpr;
    const cssHeight = height / dpr;
    const centerY = cssHeight / 2;

    // Standard Lead II ECG calculation
    const cycleLength = 200; // in pixels
    const getEcgY = (x) => {
      const pos = x % cycleLength;
      if (pos >= 20 && pos < 40) {
        // P-wave
        const p = (pos - 20) / 20;
        return centerY - Math.sin(p * Math.PI) * 14;
      } else if (pos >= 58 && pos < 66) {
        // Q-wave
        const p = (pos - 58) / 8;
        return centerY + Math.sin(p * Math.PI) * 9;
      } else if (pos >= 66 && pos < 80) {
        // R-wave (Sharp Tall Spike)
        const p = (pos - 66) / 14;
        if (p < 0.5) {
          return centerY - (p / 0.5) * 72;
        } else {
          return centerY - (1 - (p - 0.5) / 0.5) * 72;
        }
      } else if (pos >= 80 && pos < 92) {
        // S-wave
        const p = (pos - 80) / 12;
        return centerY + Math.sin(p * Math.PI) * 22;
      } else if (pos >= 115 && pos < 150) {
        // T-wave
        const p = (pos - 115) / 35;
        return centerY - Math.sin(p * Math.PI) * 18;
      }
      return centerY;
    };

    let cursorX = 0;
    const speed = 4.2; // sweeps smoothly
    let animId;
    let lastBeepCycle = -1;

    // Initial monitor beep
    playMonitorBeep();

    const drawGrid = () => {
      // Background
      ctx.fillStyle = '#04070B';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Minor 1mm grid
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.06)';
      ctx.lineWidth = 0.8;
      for (let x = 0; x < cssWidth; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cssHeight);
        ctx.stroke();
      }
      for (let y = 0; y < cssHeight; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cssWidth, y);
        ctx.stroke();
      }

      // Major 5mm grid
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.16)';
      ctx.lineWidth = 1.2;
      for (let x = 0; x < cssWidth; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cssHeight);
        ctx.stroke();
      }
      for (let y = 0; y < cssHeight; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cssWidth, y);
        ctx.stroke();
      }

      // Center baseline
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(cssWidth, centerY);
      ctx.stroke();
    };

    const render = () => {
      drawGrid();

      // Check for R-wave to trigger medical monitor beep
      const currentCycle = Math.floor(cursorX / cycleLength);
      const cyclePos = cursorX % cycleLength;
      if (cyclePos >= 70 && cyclePos <= 76 && lastBeepCycle !== currentCycle) {
        lastBeepCycle = currentCycle;
        playMonitorBeep();
        setHeartRate(Math.floor(74 + Math.random() * 3));
      }

      // Draw the green glowing ECG wave from 0 to cursorX
      ctx.shadowColor = '#00FF88';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#00FF88';
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      for (let x = 0; x <= cursorX; x += 2) {
        const y = getEcgY(x);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Leading glowing sweep head (phosphor beam dot)
      const currentY = getEcgY(cursorX);
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FFFFFF';
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cursorX, currentY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Outer glowing green halo on sweep head
      ctx.strokeStyle = '#00FF88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cursorX, currentY, 9, 0, Math.PI * 2);
      ctx.stroke();

      cursorX += speed;

      const currentProgress = Math.min(100, Math.round((cursorX / (cssWidth + 40)) * 100));
      setProgress(currentProgress);

      if (cursorX < cssWidth + 60) {
        animId = requestAnimationFrame(render);
      } else {
        // Completed sweep - auto transition
        setTimeout(() => {
          onFinish();
        }, 300);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between py-6 px-4 bg-[#05080C] text-white select-none">
      
      {/* Top Bar: Telemetry & Lead II Monitor Header */}
      <div className="w-full max-w-xl flex items-center justify-between text-xs font-mono px-3 py-2 rounded-2xl bg-black/40 border border-[#00FF88]/20 shadow-[0_0_20px_rgba(0,255,136,0.1)]">
        <div className="flex items-center gap-2 text-[#00FF88]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-ping" />
          <span className="font-black tracking-widest text-[11px]">ECG LEAD II &bull; 25mm/s &bull; 10mm/mV</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">HR:</span>
            <span className="text-[#00FF88] text-sm font-black font-mono">{heartRate}</span>
            <span className="text-[10px] text-slate-400">BPM</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-slate-400">SpO2:</span>
            <span className="text-sky-400 text-sm font-black font-mono">99%</span>
          </div>
        </div>
      </div>

      {/* Main Center Oscilloscope Monitor */}
      <div className="w-full max-w-xl flex flex-col items-center my-auto">
        
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[#00FF88] text-xs font-black mb-2 shadow-sm">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>SISTEM KLINIS </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-2 font-sans">
            Ners<span className="text-[#00FF88] drop-shadow-[0_0_12px_rgba(0,255,136,0.8)]">Calc</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-1">
            Asisten &amp; Kalkulator Klinis
          </p>
        </div>

        {/* ECG Grid Canvas Screen */}
        <div className="w-full rounded-2xl overflow-hidden border-2 border-[#00FF88]/40 shadow-[0_0_35px_rgba(0,255,136,0.2)] bg-[#04070B] relative">
          <div className="h-44 sm:h-52 w-full">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Real-time Rhythm Tag */}
          <div className="absolute bottom-2.5 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#00FF88]/30 text-[10px] font-mono text-[#00FF88]">
            <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
            <span>NSR (Irama Sinus Normal)</span>
          </div>
        </div>

        {/* Progress & Status */}
        <div className="w-full mt-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-[#00FF88]">
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>Sinkronisasi Parameter S.Kep...</span>
            </span>
            <span className="font-black text-white">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#00FF88] transition-all duration-75 ease-out shadow-[0_0_10px_#00FF88]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={onFinish}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-black tracking-wide text-white transition-all shadow-md hover:scale-105 active:scale-95"
        >
          <span>Masuk Langsung ke Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#00FF88]" />
        </button>
      </div>

      {/* Footer Copyright */}
      <div className="text-center font-mono text-[11px] text-slate-500 font-bold">
        &copy; Ari Suandi Putra &bull; NersCalc
      </div>
    </div>
  );
};

export default SplashScreen;
