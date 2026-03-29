import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Upload, 
  FileText, 
  AlertCircle, 
  Plus, 
  ChevronRight, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Info,
  X,
  Check
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore, ClassSession } from '@/src/store/useStore';
import { motion, AnimatePresence } from 'motion/react';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIMES = ["09:00", "11:00", "13:00", "15:00", "17:00"];

export default function Timetable() {
  const { user, schedule, updateClassStatus, addClass, removeClass, setSchedule, fetchSchedule, theme } = useStore();
  const [view, setView] = useState<'grid' | 'upload' | 'preview'>('grid');
  const [batch, setBatch] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewSchedule, setPreviewSchedule] = useState<ClassSession[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', day: 'Monday', time: '09:00' });

  useEffect(() => {
    if (user) {
      fetchSchedule(user.uid);
    }
  }, [user, fetchSchedule]);

  // Hover state for popups
  const [hoveredCell, setHoveredCell] = useState<{ day: string, time: string } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (day: string, time: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredCell({ day, time });
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCell(null);
    }, 300); // 300ms delay to prevent flickering
  };

  const handleUpload = () => {
    if (!batch || !file) return;
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const extracted: ClassSession[] = [
        { id: 'temp-1', uid: user?.uid || '', name: 'Advanced AI', day: 'Monday', time: '09:00', status: 'pending' },
        { id: 'temp-2', uid: user?.uid || '', name: 'Data Structures', day: 'Wednesday', time: '11:00', status: 'pending' },
        { id: 'temp-3', uid: user?.uid || '', name: 'Ethics in Tech', day: 'Friday', time: '15:00', status: 'pending' },
      ];
      setPreviewSchedule(extracted);
      setIsAnalyzing(false);
      setView('preview');
    }, 2000);
  };

  const finalizeImport = async () => {
    for (const item of previewSchedule) {
      await addClass({
        name: item.name,
        day: item.day,
        time: item.time,
        status: item.status
      });
    }
    setView('grid');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-500';
      case 'absent': return 'text-red-500';
      case 'late': return 'text-orange-500';
      case 'cancelled': return 'text-slate-500';
      default: return 'text-blue-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500/10 border-green-500/20';
      case 'absent': return 'bg-red-500/10 border-red-500/20';
      case 'late': return 'bg-orange-500/10 border-orange-500/20';
      case 'cancelled': return 'bg-slate-500/10 border-slate-500/20';
      default: return theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-100';
    }
  };

  // Analysis calculations
  // Filter schedule to only include sessions visible in the grid
  const visibleSchedule = schedule.filter(s => DAYS.includes(s.day) && TIMES.includes(s.time));

  const totalClasses = visibleSchedule.filter(s => s.status !== 'pending' && s.status !== 'cancelled').length;
  const attendedClasses = visibleSchedule.filter(s => s.status === 'present' || s.status === 'late').length;
  const attendanceRate = totalClasses === 0 ? 0 : Math.round((attendedClasses / totalClasses) * 100);
  
  // Calculate sessions needed for 75%
  const sessionsNeeded = Math.max(0, Math.ceil((0.75 * totalClasses - attendedClasses) / 0.25));

  // Subject-wise analysis based on visible schedule
  const subjects = Array.from(new Set(visibleSchedule.map(s => s.name)));
  const subjectStats = subjects.map(name => {
    const subClasses = visibleSchedule.filter(s => s.name === name && s.status !== 'pending' && s.status !== 'cancelled');
    const subAttended = subClasses.filter(s => s.status === 'present' || s.status === 'late').length;
    const rate = subClasses.length === 0 ? 0 : Math.round((subAttended / subClasses.length) * 100);
    return { name, rate, count: subClasses.length };
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      {/* LEFT SIDE: MAIN CONTENT */}
      <div className="flex-1 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className={cn(
              "text-4xl font-bold tracking-tight",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>Timetable</h1>
            <p className="text-slate-400 mt-2">Manage your classes and track attendance real-time.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className={cn(
                "bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg",
                theme === 'dark' ? "shadow-blue-900/40" : "shadow-blue-500/20"
              )}
            >
              <Plus size={20} /> Add Class
            </button>
            <button 
              onClick={() => setView('upload')}
              className={cn(
                "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border",
                theme === 'dark' 
                  ? "bg-white/5 hover:bg-white/10 text-white border-white/10" 
                  : "bg-blue-50 hover:bg-blue-100 text-slate-900 border-blue-100"
              )}
            >
              <Upload size={20} /> AI Import
            </button>
          </div>
        </div>

        {view === 'upload' && (
          <div className={cn(
            "border p-10 rounded-[2.5rem] backdrop-blur-sm space-y-8",
            theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
          )}>
            <div className="text-center">
              <div className="size-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-400 mx-auto mb-4">
                <BrainCircuit size={32} />
              </div>
              <h2 className={cn(
                "text-2xl font-bold",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>AI Timetable Parser</h2>
              <p className="text-slate-400 text-sm mt-2">Upload CSV, Image, or PDF. We'll extract your classes automatically.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Batch / Section</label>
                <input 
                  type="text" 
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="e.g. CS-2024-B"
                  className={cn(
                    "w-full border rounded-2xl p-4 outline-none focus:ring-2 ring-blue-500 transition-all",
                    theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50 border-blue-100 text-slate-900"
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">File Type</label>
                <div className="flex gap-2">
                  {['CSV', 'Image', 'PDF'].map(type => (
                    <div key={type} className={cn(
                      "flex-1 border rounded-2xl p-3 text-center text-xs font-bold text-slate-400",
                      theme === 'dark' ? "bg-white/5 border-white/10" : "bg-blue-50 border-blue-100"
                    )}>
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative group">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className={cn(
                "border-2 border-dashed rounded-3xl p-10 text-center group-hover:border-blue-500/50 transition-all",
                theme === 'dark' ? "bg-white/5 border-white/10" : "bg-blue-50 border-blue-100"
              )}>
                <Upload className="mx-auto text-slate-500 mb-4 group-hover:text-blue-400 transition-colors" size={32} />
                <p className="text-sm text-slate-400">
                  {file ? <span className="text-blue-400 font-bold">{file.name}</span> : "Drag and drop or click to upload"}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setView('grid')}
                className={cn(
                  "flex-1 py-4 rounded-2xl font-bold transition-all border",
                  theme === 'dark'
                    ? "bg-white/5 hover:bg-white/10 text-white border-white/10"
                    : "bg-blue-50 hover:bg-blue-100 text-slate-900 border-blue-100"
                  )}
                >
                  Cancel
                </button>
              <button 
                disabled={!batch || !file || isAnalyzing}
                onClick={handleUpload}
                className={cn(
                  "flex-[2] py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg",
                  (!batch || !file || isAnalyzing) 
                    ? (theme === 'dark' ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-slate-200 text-slate-400 cursor-not-allowed")
                    : (theme === 'dark' ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40" : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20")
                )}
              >
                {isAnalyzing ? "Analyzing..." : <><Zap size={20} /> Analyze & Import</>}
              </button>
            </div>
          </div>
        )}

        {view === 'preview' && (
          <div className={cn(
            "border p-8 rounded-[2.5rem] backdrop-blur-sm space-y-6",
            theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
          )}>
            <div className="flex justify-between items-center">
              <h2 className={cn(
                "text-2xl font-bold",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>Review Extracted Classes</h2>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest">AI Preview</span>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {previewSchedule.map((session, idx) => (
                <div key={idx} className={cn(
                  "flex items-center gap-4 border p-4 rounded-2xl group",
                  theme === 'dark' ? "bg-black/40 border-white/5" : "bg-blue-50 border-blue-100"
                )}>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={session.name}
                      onChange={(e) => {
                        const newPreview = [...previewSchedule];
                        newPreview[idx].name = e.target.value;
                        setPreviewSchedule(newPreview);
                      }}
                      className={cn(
                        "bg-transparent font-bold outline-none w-full border-b border-transparent focus:border-blue-500/50",
                        theme === 'dark' ? "text-white" : "text-slate-900"
                      )}
                    />
                    <div className="flex gap-4 mt-1">
                      <select 
                        value={session.day}
                        onChange={(e) => {
                          const newPreview = [...previewSchedule];
                          newPreview[idx].day = e.target.value;
                          setPreviewSchedule(newPreview);
                        }}
                        className="bg-transparent text-[10px] text-slate-500 font-bold uppercase outline-none"
                      >
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select 
                        value={session.time}
                        onChange={(e) => {
                          const newPreview = [...previewSchedule];
                          newPreview[idx].time = e.target.value;
                          setPreviewSchedule(newPreview);
                        }}
                        className="bg-transparent text-[10px] text-slate-500 font-bold uppercase outline-none"
                      >
                        {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPreviewSchedule(previewSchedule.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setView('upload')}
                className={cn(
                  "flex-1 py-4 rounded-2xl font-bold transition-all border",
                  theme === 'dark'
                    ? "bg-white/5 hover:bg-white/10 text-white border-white/10"
                    : "bg-blue-50 hover:bg-blue-100 text-slate-900 border-blue-100"
                  )}
                >
                  Back
                </button>
              <button 
                onClick={finalizeImport}
                className={cn(
                  "flex-[2] bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2",
                  theme === 'dark' ? "shadow-green-900/40" : "shadow-green-500/20"
                )}
              >
                <Check size={20} /> Finalize & Add to Grid
              </button>
            </div>
          </div>
        )}

        {view === 'grid' && (
          <div className={cn(
            "border rounded-3xl overflow-hidden backdrop-blur-sm relative",
            theme === 'dark' ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200 shadow-sm"
          )}>
            <div className={cn(
              "grid grid-cols-6 border-b",
              theme === 'dark' ? "border-white/10 bg-slate-900/80" : "border-blue-100 bg-blue-50"
            )}>
              <div className="p-4 border-r border-white/5 font-bold text-slate-500 text-xs uppercase tracking-widest">Day</div>
              {TIMES.map(time => (
                <div key={time} className={cn(
                  "p-4 font-bold text-center text-xs uppercase tracking-widest",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>{time}</div>
              ))}
            </div>
            
            {DAYS.map(day => (
              <div key={day} className={cn(
                "grid grid-cols-6 border-b last:border-0 h-28",
                theme === 'dark' ? "border-white/5" : "border-slate-100"
              )}>
                <div className="p-4 border-r border-white/5 flex items-center text-slate-500 font-medium text-sm">{day}</div>
                {TIMES.map(time => {
                  const session = schedule.find(s => s.day === day && s.time === time);
                  const isHovered = hoveredCell?.day === day && hoveredCell?.time === time;

                  return (
                    <div 
                      key={time} 
                      className={cn(
                        "p-2 border-r last:border-0 transition-colors cursor-pointer group relative",
                        theme === 'dark' ? "border-white/5 hover:bg-white/5" : "border-blue-50 hover:bg-blue-100"
                      )}
                      onMouseEnter={() => handleMouseEnter(day, time)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {session ? (
                        <div className={cn(
                          "h-full rounded-2xl p-3 flex flex-col justify-between border transition-all relative overflow-hidden",
                          getStatusBg(session.status),
                          theme === 'light' && session.status === 'pending' && "bg-blue-50 border-blue-100"
                        )}>
                          <div className="flex justify-between items-start">
                            <span className={cn(
                              "text-xs font-bold line-clamp-2",
                              theme === 'dark' ? "text-white" : "text-slate-900"
                            )}>{session.name}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeClass(session.id); }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-500 transition-all"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          <div className="flex gap-1.5 mt-2 items-center">
                            <div className={cn("size-2 rounded-full", session.status === 'pending' ? 'bg-blue-500/40' : getStatusColor(session.status).replace('text-', 'bg-'))} />
                            <span className="text-[10px] text-slate-500 font-bold uppercase">{session.status}</span>
                          </div>

                          {/* HOVER POPUP */}
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className={cn(
                                  "absolute inset-0 z-20 backdrop-blur-md p-2 flex flex-col gap-1 rounded-2xl",
                                  theme === 'dark' ? "bg-slate-950/90" : "bg-white/95 shadow-xl border border-slate-200"
                                )}
                              >
                                <div className="grid grid-cols-2 gap-1 h-full">
                                  {[
                                    { status: 'present', label: 'Present', icon: CheckCircle2, color: 'text-green-500' },
                                    { status: 'absent', label: 'Absent', icon: XCircle, color: 'text-red-500' },
                                    { status: 'late', label: 'Late', icon: Clock, color: 'text-orange-500' },
                                    { status: 'cancelled', label: 'Cancel', icon: X, color: 'text-slate-500' },
                                  ].map(opt => (
                                    <button
                                      key={opt.status}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateClassStatus(session.id, opt.status as any);
                                        setHoveredCell(null);
                                      }}
                                      className={cn(
                                        "flex flex-col items-center justify-center gap-1 rounded-xl transition-colors",
                                        theme === 'dark' ? "hover:bg-white/10" : "hover:bg-blue-100"
                                      )}
                                    >
                                      <opt.icon size={14} className={opt.color} />
                                      <span className="text-[8px] font-bold uppercase text-slate-400">{opt.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setNewClass({ ...newClass, day, time });
                              setIsAddModalOpen(true);
                            }}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              theme === 'dark' ? "bg-white/5 text-slate-500 hover:text-white" : "bg-blue-50 text-slate-400 hover:text-slate-900"
                            )}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE: ANALYSIS PANEL */}
      <div className="w-full lg:w-80 space-y-6">
        <div className={cn(
          "border p-6 rounded-[2rem] backdrop-blur-sm space-y-6",
          theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-400" />
              <h2 className={cn(
                "text-lg font-bold",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>Attendance Analysis</h2>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp size={10} />
              <span>+2.4%</span>
            </div>
          </div>

          {/* OVERALL ATTENDANCE BAR */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Overall Attendance</span>
                <span className={cn(
                  "text-3xl font-black",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>{attendanceRate}%</span>
              </div>
              <div className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                attendanceRate >= 75 ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"
              )}>
                {attendanceRate >= 75 ? 'Good Standing' : 'Below Target'}
              </div>
            </div>
            <div className={cn(
              "h-3 w-full rounded-full overflow-hidden p-0.5 border",
              theme === 'dark' ? "bg-slate-800 border-white/5" : "bg-blue-50 border-blue-100"
            )}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${attendanceRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]",
                  attendanceRate >= 75 ? "bg-green-500" : "bg-red-500"
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={cn(
              "p-4 rounded-2xl border",
              theme === 'dark' ? "bg-black/40 border-white/5" : "bg-blue-50 border-blue-100"
            )}>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Attended</span>
              <span className={cn(
                "text-xl font-bold",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>{attendedClasses}</span>
              <span className="text-[10px] text-slate-600 ml-1">/ {totalClasses}</span>
            </div>
            <div className={cn(
              "p-4 rounded-2xl border",
              theme === 'dark' ? "bg-black/40 border-white/5" : "bg-blue-50 border-blue-100"
            )}>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target 75%</span>
              <span className={cn("text-xl font-bold", sessionsNeeded > 0 ? "text-orange-400" : "text-green-400")}>
                {sessionsNeeded === 0 ? "Safe" : `+${sessionsNeeded}`}
              </span>
              <span className="text-[10px] text-slate-600 ml-1">sessions</span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subject-wise</h3>
            <div className="space-y-3">
              {subjectStats.map((sub, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className={theme === 'dark' ? "text-slate-300" : "text-slate-700"}>{sub.name}</span>
                    <span className={sub.rate >= 75 ? "text-green-400" : "text-red-400"}>{sub.rate}%</span>
                  </div>
                  <div className={cn(
                    "h-1 w-full rounded-full overflow-hidden",
                    theme === 'dark' ? "bg-slate-800" : "bg-blue-100"
                  )}>
                    <div 
                      className={cn("h-full transition-all duration-500", sub.rate >= 75 ? "bg-green-500" : "bg-red-500")}
                      style={{ width: `${sub.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-2xl flex gap-3 border",
            theme === 'dark' ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-100"
          )}>
            <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className={cn(
              "text-[10px] leading-relaxed",
              theme === 'dark' ? "text-blue-300" : "text-blue-700"
            )}>
              {sessionsNeeded > 0 
                ? `You need to attend ${sessionsNeeded} more classes without missing any to reach the 75% threshold.`
                : "Great job! You are currently above the required attendance threshold."}
            </p>
          </div>
        </div>
      </div>

      {/* ADD CLASS MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "border w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl",
                theme === 'dark' ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"
              )}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={cn(
                  "text-2xl font-bold",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>Add Class</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  className={cn(
                    "transition-colors",
                    theme === 'dark' ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900"
                  )}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Subject Name</label>
                  <input 
                    type="text" 
                    value={newClass.name}
                    onChange={e => setNewClass({...newClass, name: e.target.value})}
                    placeholder="e.g. Quantum Physics"
                    className={cn(
                      "w-full border rounded-2xl p-4 outline-none focus:ring-2 ring-blue-500 transition-all",
                      theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50 border-blue-100 text-slate-900"
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Day</label>
                    <select 
                      value={newClass.day}
                      onChange={e => setNewClass({...newClass, day: e.target.value})}
                      className={cn(
                        "w-full border rounded-2xl p-4 outline-none focus:ring-2 ring-blue-500 transition-all appearance-none",
                        theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50 border-blue-100 text-slate-900"
                      )}
                    >
                      {DAYS.map(d => (
                        <option 
                          key={d} 
                          value={d} 
                          className={theme === 'dark' ? "bg-slate-900 text-white" : "bg-white text-slate-900"}
                        >
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Time</label>
                    <select 
                      value={newClass.time}
                      onChange={e => setNewClass({...newClass, time: e.target.value})}
                      className={cn(
                        "w-full border rounded-2xl p-4 outline-none focus:ring-2 ring-blue-500 transition-all appearance-none",
                        theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50 border-blue-100 text-slate-900"
                      )}
                    >
                      {TIMES.map(t => (
                        <option 
                          key={t} 
                          value={t} 
                          className={theme === 'dark' ? "bg-slate-900 text-white" : "bg-white text-slate-900"}
                        >
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!newClass.name) return;
                    addClass({ ...newClass, status: 'pending' });
                    setIsAddModalOpen(false);
                    setNewClass({ name: '', day: 'Monday', time: '09:00' });
                  }}
                  className={cn(
                    "w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg",
                    theme === 'dark' ? "shadow-blue-900/40" : "shadow-blue-500/20"
                  )}
                >
                  Add to Timetable
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BrainCircuit({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.248 4 4 0 0 0 5.168 3.757A3 3 0 1 0 12 5Z"></path>
      <path d="M9 13a4.5 4.5 0 0 0 3-4"></path>
      <path d="M6.003 5.125A3 3 0 0 0 12 5"></path>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.52 8.248 4 4 0 0 1-5.168 3.757A3 3 0 1 1 12 5Z"></path>
      <path d="M15 13a4.5 4.5 0 0 1-3-4"></path>
    </svg>
  );
}

function Zap({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  );
}
