import React from 'react';
import { Bell, Zap, Trophy, LogOut, Sun, Moon, User } from 'lucide-react';
import { useStore } from '@/src/store/useStore';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { cn } from '../lib/utils';

interface HeaderProps {
  onNavigate?: (tab: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const { user, xp, level, rank, setUser, theme, setTheme } = useStore();
  const nextLevelXP = 1000;
  const progress = (xp % nextLevelXP) / 10;

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!user) return null;

  return (
    <header className={cn(
      "h-20 border-b flex items-center justify-between px-10 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500",
      theme === 'dark' ? "border-white/5 bg-black/20" : "border-slate-200 bg-white/80"
    )}>
      <div className="flex flex-col">
        <p className={cn(
          "text-xs font-bold uppercase tracking-widest mb-1 italic",
          theme === 'dark' ? "text-slate-500" : "text-slate-400"
        )}>Welcome back,</p>
        <h2 className={cn(
          "text-lg font-bold",
          theme === 'dark' ? "text-white" : "text-slate-900"
        )}>{user.username}</h2>
      </div>

      <div className="flex items-center gap-10">
        {/* THEME TOGGLE */}
        <button 
          onClick={toggleTheme}
          className={cn(
            "p-2.5 rounded-xl border transition-all hover:scale-110",
            theme === 'dark' ? "bg-white/5 border-white/10 text-slate-400 hover:text-blue-400" : "bg-blue-50 border-blue-100 text-slate-600 hover:text-blue-600"
          )}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* XP BAR SYSTEM */}
        <div className="w-72 hidden md:block">
          <div className="flex justify-between text-[10px] mb-2 uppercase tracking-tighter font-black">
            <span className="text-blue-400 flex items-center gap-1">
              <Zap size={10} /> Level {level}
            </span>
            <span className={theme === 'dark' ? "text-slate-500" : "text-slate-400"}>
              {xp % nextLevelXP} / {nextLevelXP} XP
            </span>
          </div>
          <div className={cn(
            "h-2 w-full rounded-full overflow-hidden border",
            theme === 'dark' ? "bg-slate-800 border-white/5" : "bg-slate-200 border-slate-300"
          )}>
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        {/* RANK BADGE */}
        <div className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-2xl border transition-colors cursor-default group",
          theme === 'dark' ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-blue-50 border-blue-100 hover:bg-blue-100"
        )}>
          <div className="bg-indigo-500/20 p-1.5 rounded-lg border border-indigo-500/30">
            <Trophy size={16} className="text-indigo-400" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">{rank} Rank</span>
        </div>

        <div className={cn(
          "flex items-center gap-4 border-l pl-6",
          theme === 'dark' ? "border-white/10" : "border-slate-200"
        )}>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/10 rounded-full text-slate-400 hover:text-red-400 transition-all group relative"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
          <button 
            onClick={() => onNavigate?.('settings')}
            className={cn(
              "w-10 h-10 rounded-full p-[2px] transition-transform hover:scale-110 active:scale-95",
              theme === 'dark' ? "bg-gradient-to-br from-blue-400 to-indigo-600" : "bg-gradient-to-br from-blue-600 to-indigo-800"
            )}
          >
            <div className={cn(
              "w-full h-full rounded-full border border-black flex items-center justify-center font-bold text-xs",
              theme === 'dark' ? "bg-slate-900 text-white" : "bg-white text-blue-600"
            )}>
              {user.username.substring(0, 2).toUpperCase()}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
