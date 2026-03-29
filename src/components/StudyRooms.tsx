import React from 'react';
import { Users, Lock, Play, Plus, Search, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function StudyRooms() {
  const { theme } = useStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={cn(
            "text-4xl font-bold tracking-tight",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>Study Rooms</h1>
          <p className="text-slate-400 mt-2">Join virtual rooms for collaborative deep work.</p>
        </div>
        <div className="flex gap-4">
          <button className={cn(
            "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border",
            theme === 'dark' 
              ? "bg-white/5 hover:bg-white/10 text-white border-white/10" 
              : "bg-blue-50 hover:bg-blue-100 text-slate-900 border-blue-100"
          )}>
            <Plus size={20} /> Create Room
          </button>
          <button className={cn(
            "bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg",
            theme === 'dark' ? "shadow-blue-900/40" : "shadow-blue-500/20"
          )}>
            <Play size={20} fill="currentColor" /> Join Random
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Library Floor 3', topic: 'Calculus', users: 12, private: false },
          { name: 'Late Night Grind', topic: 'Computer Science', users: 8, private: true },
          { name: 'Exam Prep Hub', topic: 'Physics', users: 24, private: false },
        ].map((room) => (
          <div 
            key={room.name} 
            className={cn(
              "p-8 rounded-[2.5rem] backdrop-blur-sm hover:border-blue-500/30 transition-all group relative overflow-hidden border",
              theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
            )}
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Users size={80} />
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                <Users size={24} />
              </div>
              {room.private && (
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500 border border-red-500/20">
                  <Lock size={14} />
                </div>
              )}
            </div>

            <h3 className={cn(
              "text-xl font-bold mb-1",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>{room.name}</h3>
            <p className="text-sm text-blue-400 font-bold uppercase tracking-tighter mb-6">{room.topic}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={cn(
                      "size-6 rounded-full border-2 bg-slate-800",
                      theme === 'dark' ? "border-[#020617]" : "border-white"
                    )} />
                  ))}
                </div>
                <span className="text-xs font-bold">{room.users} Active</span>
              </div>
              <button className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
                theme === 'dark' 
                  ? "bg-white/5 hover:bg-white/10 text-white border-white/5" 
                  : "bg-blue-50 hover:bg-blue-100 text-slate-900 border-blue-100"
              )}>
                Enter
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* LOBBY SYSTEM INFO */}
      <div className={cn(
        "p-8 rounded-[2.5rem] flex items-center gap-8 border",
        theme === 'dark' ? "bg-indigo-600/10 border-indigo-500/20" : "bg-indigo-50 border-indigo-100"
      )}>
        <div className="p-5 bg-indigo-500/20 rounded-3xl text-indigo-400">
          <Shield size={32} />
        </div>
        <div>
          <h4 className={cn(
            "text-xl font-bold mb-2",
            theme === 'dark' ? "text-white" : "text-indigo-900"
          )}>Lobby System</h4>
          <p className={cn(
            "text-sm max-w-2xl",
            theme === 'dark' ? "text-slate-400" : "text-indigo-700"
          )}>Join via Lobby ID + password for private sessions. Earn XP based on active study time in the room. Shared notes and simple chat available in every room.</p>
        </div>
      </div>
    </div>
  );
}
