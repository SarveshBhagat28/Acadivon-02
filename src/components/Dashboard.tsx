import React from 'react';
import { CheckCircle2, Flame, AlertCircle, BrainCircuit, Zap, Clock, ChevronRight, Target } from 'lucide-react';
import { useStore } from '@/src/store/useStore';
import { cn } from '@/src/lib/utils';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { attendance, assignments, theme, streak } = useStore();
  const pendingAssignments = assignments.filter(a => a.status === 'pending' || a.status === 'overdue');
  const upcomingAssignments = pendingAssignments.slice(0, 2);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* TOP ROW STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigate('timetable')}
          className={cn(
            "p-6 rounded-3xl backdrop-blur-sm transition-all group cursor-pointer border",
            theme === 'dark' 
              ? "bg-slate-900/40 border-white/5 hover:border-blue-500/30" 
              : "bg-white border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Attendance</h3>
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
          <div className="flex items-end gap-3">
            <span className={cn(
              "text-4xl font-black",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>{attendance}%</span>
            <span className="text-[10px] text-green-400 font-bold mb-1">+4% this week</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('community')}
          className={cn(
            "p-6 rounded-3xl backdrop-blur-sm transition-all group cursor-pointer border",
            theme === 'dark' 
              ? "bg-slate-900/40 border-white/5 hover:border-blue-500/30" 
              : "bg-white border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Study Streak</h3>
            <Flame size={16} className="text-orange-500" />
          </div>
          <div className="flex items-end gap-3">
            <span className={cn(
              "text-4xl font-black",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>{streak} Days</span>
            <span className="text-[10px] text-orange-400 font-bold mb-1">Top 5% of Students</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('assignments')}
          className={cn(
            "p-6 rounded-3xl backdrop-blur-sm transition-all group cursor-pointer border",
            theme === 'dark' 
              ? "bg-slate-900/40 border-white/5 hover:border-blue-500/30" 
              : "bg-white border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Pending Assignments</h3>
            <AlertCircle size={16} className="text-blue-500" />
          </div>
          <div className="flex items-end gap-3">
            <span className={cn(
              "text-4xl font-black",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>{pendingAssignments.length.toString().padStart(2, '0')}</span>
            <span className="text-[10px] text-slate-500 font-bold mb-1">Due soon</span>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI HUB PREVIEW SECTION */}
        <div 
          onClick={() => onNavigate('ai-hub')}
          className={cn(
            "p-8 rounded-[2rem] border relative overflow-hidden group cursor-pointer transition-all",
            theme === 'dark' 
              ? "bg-gradient-to-br from-blue-600/20 via-indigo-900/10 to-transparent border-blue-500/20 shadow-lg shadow-blue-900/10" 
              : "bg-gradient-to-br from-blue-50 via-indigo-50 to-white border-blue-200 shadow-md hover:shadow-xl"
          )}
        >
          <div className={cn(
            "absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700",
            theme === 'dark' ? "text-white" : "text-blue-600"
          )}>
            <BrainCircuit size={140} />
          </div>
          <h2 className={cn(
            "text-2xl font-bold mb-2",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>AI Hub</h2>
          <p className={cn(
            "text-sm mb-6 max-w-[250px]",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            Generate quizzes, parse notes, and get tutor help using <span className="text-blue-600 font-bold italic">Acadivon AI</span>.
          </p>
          
          <div className="space-y-3 relative z-10">
            <button 
              onClick={(e) => { e.stopPropagation(); onNavigate('ai-hub'); }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/40"
            >
              <Zap size={18} /> Generate AI Quiz (+10 XP)
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onNavigate('ai-hub'); }}
              className={cn(
                "w-full font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all border",
                theme === 'dark' 
                  ? "bg-white/5 hover:bg-white/10 text-white border-white/10" 
                  : "bg-white hover:bg-blue-50 text-slate-700 border-slate-200 shadow-sm"
              )}
            >
              Upload Notes for Parsing
            </button>
          </div>
        </div>

        {/* UPCOMING ASSIGNMENTS LIST */}
        <div className={cn(
          "p-8 rounded-[2rem] backdrop-blur-sm border transition-all",
          theme === 'dark' 
            ? "bg-slate-900/20 border-white/5" 
            : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={cn(
              "text-xl font-bold",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>Upcoming Assignments</h2>
            <button 
              onClick={() => onNavigate('assignments')}
              className="text-blue-600 text-xs font-bold hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {upcomingAssignments.length > 0 ? upcomingAssignments.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onNavigate('assignments')}
                className={cn(
                  "flex items-center justify-between p-4 border rounded-2xl transition-colors cursor-pointer",
                  theme === 'dark' 
                    ? "bg-black/40 border-white/5 hover:border-white/10" 
                    : "bg-blue-50 border-slate-200 hover:bg-white hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-1 h-8 rounded-full ${item.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`} />
                  <div>
                    <h4 className={cn(
                      "font-bold text-sm",
                      theme === 'dark' ? "text-white" : "text-slate-900"
                    )}>{item.title}</h4>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1"><Clock size={10} /> {item.dueDate}, {item.dueTime}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-600" />
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm italic">No upcoming assignments. Great job!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOCUS MODE PROMO */}
      <div 
        onClick={() => onNavigate('focus')}
        className={cn(
          "p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 border-dashed relative group overflow-hidden cursor-pointer border transition-all",
          theme === 'dark' 
            ? "bg-[#050b1a] border-blue-500/10" 
            : "bg-blue-50/50 border-blue-200"
        )}
      >
        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Target size={40} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
        <h3 className={cn(
          "text-xl font-bold italic tracking-wide",
          theme === 'dark' ? "text-white" : "text-slate-900"
        )}>Enter Focus Mode</h3>
        <p className="text-slate-500 text-sm max-w-md">Activate Focus Shield to block notifications and earn +10 XP for every 25 minutes of deep work.</p>
        <div className="flex gap-4 mt-2">
          <div className="text-xs font-black uppercase text-blue-600 tracking-tighter bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Pomodoro Timer</div>
          <div className="text-xs font-black uppercase text-indigo-600 tracking-tighter bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Distraction Block</div>
        </div>
      </div>
    </div>
  );
}
