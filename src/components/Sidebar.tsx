import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  BrainCircuit, 
  Calendar, 
  Target, 
  Users, 
  Settings, 
  Trophy,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { LOGO_URL } from '@/src/constants';
import { useStore } from '@/src/store/useStore';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { name: 'AI Hub', icon: BrainCircuit, id: 'ai-hub', badge: 'New' },
  { name: 'Timetable', icon: Calendar, id: 'timetable' },
  { name: 'Assignments', icon: BookOpen, id: 'assignments' },
  { name: 'Focus Mode', icon: Target, id: 'focus' },
  { name: 'Study Rooms', icon: Users, id: 'rooms' },
  { name: 'Community', icon: MessageSquare, id: 'community' },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { theme, user } = useStore();

  const initials = user?.username
    ? user.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <aside className={cn(
      "w-64 border-r flex flex-col backdrop-blur-xl h-full transition-colors duration-500",
      theme === 'dark' ? "bg-black/40 border-white/5" : "bg-white/80 border-slate-200"
    )}>
      <div className="p-8 flex items-center gap-3">
        <div className="size-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          <img src={LOGO_URL} alt="Acadivon Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <h1 className={cn(
          "text-xl font-bold tracking-tighter uppercase",
          theme === 'dark' ? "text-white" : "text-slate-900"
        )}>Acadivon</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id
                ? (theme === 'dark' 
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner" 
                    : "bg-blue-600 text-white shadow-lg shadow-blue-500/30")
                : (theme === 'dark'
                    ? "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                    : "text-slate-500 hover:bg-blue-50 hover:text-slate-900")
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="font-semibold text-sm">{item.name}</span>
            </div>
            {item.badge && (
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider",
                activeTab === item.id ? "bg-white text-blue-600" : "bg-blue-500 text-white"
              )}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className={cn(
        "p-4 border-t space-y-2",
        theme === 'dark' ? "border-white/5" : "border-slate-200"
      )}>
        {/* PROFILE SECTION */}
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-2xl transition-all group",
            theme === 'dark' ? "hover:bg-white/5" : "hover:bg-blue-50"
          )}
        >
          <div className={cn(
            "size-10 rounded-xl flex items-center justify-center text-xs font-bold border transition-transform group-hover:scale-110",
            theme === 'dark' ? "bg-blue-600/20 text-blue-400 border-blue-500/20" : "bg-blue-600 text-white border-blue-700"
          )}>
            {initials}
          </div>
          <div className="text-left overflow-hidden">
            <p className={cn(
              "text-sm font-bold truncate",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>{user?.username}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">View Profile</p>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "flex items-center gap-3 transition-colors w-full px-4 py-3 rounded-xl",
            activeTab === 'settings' 
              ? (theme === 'dark'
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner"
                  : "bg-blue-600 text-white shadow-lg shadow-blue-500/30")
              : (theme === 'dark'
                  ? "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  : "text-slate-500 hover:text-slate-900 hover:bg-blue-50")
          )}
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
