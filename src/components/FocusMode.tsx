import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Target, Zap, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function FocusMode() {
  const { addXP, theme } = useStore();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isShieldActive, setIsShieldActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      addXP(10);
      setTimeLeft(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, addXP]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 py-10">
      <div className="text-center space-y-4">
        <h1 className={cn(
          "text-5xl font-black tracking-tighter uppercase",
          theme === 'dark' ? "text-white" : "text-slate-900"
        )}>Focus Mode</h1>
        <p className="text-slate-500 font-medium">Deep work sessions with distraction blocking.</p>
      </div>

      <div className="relative flex flex-col items-center">
        {/* TIMER CIRCLE */}
        <div className="relative size-80 flex items-center justify-center">
          <svg className="size-full -rotate-90">
            <circle 
              cx="160" cy="160" r="150" 
              fill="transparent" 
              stroke="currentColor" 
              strokeWidth="12" 
              className={theme === 'dark' ? "text-slate-900" : "text-blue-100"} 
            />
            <circle 
              cx="160" cy="160" r="150" 
              fill="transparent" 
              stroke="currentColor" 
              strokeWidth="12" 
              strokeDasharray={942} 
              strokeDashoffset={942 - (942 * timeLeft) / (25 * 60)}
              className={cn(
                "transition-all duration-1000",
                isActive ? "text-blue-500" : "text-slate-700"
              )} 
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={cn(
              "text-7xl font-black tabular-nums",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>{formatTime(timeLeft)}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
              {isActive ? "Focusing..." : "Ready?"}
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex gap-6 mt-12">
          <button 
            onClick={resetTimer}
            className={cn(
              "p-4 border rounded-full transition-all",
              theme === 'dark' ? "bg-slate-900 border-white/5 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm"
            )}
          >
            <RotateCcw size={24} />
          </button>
          <button 
            onClick={toggleTimer}
            className={cn(
              "p-6 rounded-full transition-all shadow-2xl",
              isActive 
                ? "bg-red-500 text-white shadow-red-900/20" 
                : "bg-blue-600 text-white shadow-blue-900/40"
            )}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
          </button>
          <button 
            onClick={() => setIsShieldActive(!isShieldActive)}
            className={cn(
              "p-4 border rounded-full transition-all",
              isShieldActive 
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" 
                : (theme === 'dark' ? "bg-slate-900 border-white/5 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm")
            )}
          >
            <Shield size={24} />
          </button>
        </div>
      </div>

      {/* STATS & INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cn(
          "p-8 rounded-[2.5rem] backdrop-blur-sm flex items-center gap-6 border",
          theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
            <Zap size={28} />
          </div>
          <div>
            <h4 className={cn(
              "font-bold",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>Earn XP</h4>
            <p className="text-sm text-slate-500">Complete a 25-minute session to earn +10 XP.</p>
          </div>
        </div>
        <div className={cn(
          "p-8 rounded-[2.5rem] backdrop-blur-sm flex items-center gap-6 border",
          theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400">
            <Target size={28} />
          </div>
          <div>
            <h4 className={cn(
              "font-bold",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>Focus Shield</h4>
            <p className="text-sm text-slate-500">Enable to block all non-essential notifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
