import React from 'react';
import { Users, MessageSquare, FileText, Plus, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function Community() {
  const { theme } = useStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={cn(
            "text-4xl font-bold tracking-tight",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>Community</h1>
          <p className="text-slate-400 mt-2">Connect with fellow students and share knowledge.</p>
        </div>
        <button className={cn(
          "bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg",
          theme === 'dark' ? "shadow-blue-900/40" : "shadow-blue-500/20"
        )}>
          <Plus size={20} /> New Discussion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search discussions, notes, or groups..."
              className={cn(
                "w-full border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 ring-blue-500/50 transition-all",
                theme === 'dark' ? "bg-slate-900/40 border-white/5 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
              )}
            />
          </div>

          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={cn(
                "p-6 rounded-3xl backdrop-blur-sm transition-all group border",
                theme === 'dark' ? "bg-slate-900/40 border-white/5 hover:border-blue-500/30" : "bg-white border-slate-200 shadow-sm hover:border-blue-500/30"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600" />
                <div>
                  <h4 className={cn(
                    "text-sm font-bold",
                    theme === 'dark' ? "text-white" : "text-slate-900"
                  )}>User_{i}23</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Expert Rank • 2h ago</p>
                </div>
              </div>
              <h3 className={cn(
                "text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>Best resources for learning Quantum Mechanics?</h3>
              <p className="text-sm text-slate-400 mb-6">I'm struggling with the mathematical foundation. Any recommendations for textbooks or online courses that simplify the concepts?</p>
              <div className="flex items-center gap-6 text-slate-500">
                <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <MessageSquare size={16} />
                  <span className="text-xs font-bold">12 Replies</span>
                </button>
                <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <FileText size={16} />
                  <span className="text-xs font-bold">3 Shared Notes</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className={cn(
            "p-6 rounded-3xl backdrop-blur-sm border",
            theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
          )}>
            <h3 className={cn(
              "text-lg font-bold mb-4 flex items-center gap-2",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>
              <Users className="text-blue-400" size={20} /> Active Groups
            </h3>
            <div className="space-y-4">
              {['Physics Study Group', 'Calculus Wizards', 'Architecture Hub'].map((group) => (
                <div 
                  key={group} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer",
                    theme === 'dark' ? "bg-white/5 border-white/5 hover:border-white/10" : "bg-blue-50 border-blue-100 hover:bg-blue-100"
                  )}
                >
                  <span className={cn(
                    "text-sm font-bold",
                    theme === 'dark' ? "text-slate-300" : "text-slate-600"
                  )}>{group}</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-black uppercase">Join</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
