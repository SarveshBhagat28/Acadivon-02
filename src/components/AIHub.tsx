import React, { useState, useRef } from 'react';
import { Brain, Upload, Play, BrainCircuit, FileText, Calendar, Clock, CheckCircle2, AlertCircle, ChevronRight, Zap, Coffee, Sparkles, FileUp } from 'lucide-react';
import { useStore } from '@/src/store/useStore';
import { cn } from '@/src/lib/utils';
import { generateQuizFromContent, generateStudyPlan, FileData } from '@/src/services/geminiService';
import { QuizQuestion, StudyPlan } from '../types';

export default function AIHub() {
  const { addXP, theme, assignments } = useStore();
  const [activeTab, setActiveTab] = useState<'quiz' | 'planner'>('quiz');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Quiz State
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [fileName, setFileName] = useState('');
  const [quizResults, setQuizResults] = useState<QuizQuestion[]>([]);
  
  // Planner State
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [customAssignmentName, setCustomAssignmentName] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);

  const pendingAssignments = assignments.filter(a => a.status === 'pending');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      setSelectedFile({
        data: base64,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateQuiz = async () => {
    if (!notes.trim() && !selectedFile) return;
    setLoading(true);
    try {
      const results = await generateQuizFromContent(notes, selectedFile || undefined);
      setQuizResults(results);
      setStep(3);
      addXP(20);
    } catch (error) {
      console.error("Quiz Generation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    const name = selectedAssignmentId 
      ? assignments.find(a => a.id === selectedAssignmentId)?.title || ''
      : customAssignmentName;
    
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const plan = await generateStudyPlan(name, estimatedHours);
      setStudyPlan(plan);
      setStep(3);
      addXP(15);
    } catch (error) {
      console.error("Plan Generation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setQuizResults([]);
    setStudyPlan(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={cn(
              "text-4xl font-bold tracking-tight",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>AI Hub</h1>
            {useStore.getState().user?.email === 'bhagatsarvesh01@gmail.com' && (
              <button 
                onClick={() => { useStore.getState().setStreak(7); addXP(1); }}
                className="opacity-0 hover:opacity-100 text-[8px] text-slate-500"
              >
                Set Streak
              </button>
            )}
          </div>
          <p className="text-slate-400 mt-2">Intelligent tools to boost your learning efficiency.</p>
        </div>
        
        <div className={cn(
          "flex p-1 rounded-2xl border self-start",
          theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
        )}>
          <button 
            onClick={() => { setActiveTab('quiz'); reset(); }}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'quiz' 
                ? (theme === 'dark' ? "bg-blue-600 text-white shadow-lg" : "bg-blue-600 text-white shadow-md") 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Brain size={16} /> Quiz Generator
          </button>
          <button 
            onClick={() => { setActiveTab('planner'); reset(); }}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'planner' 
                ? (theme === 'dark' ? "bg-blue-600 text-white shadow-lg" : "bg-blue-600 text-white shadow-md") 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Calendar size={16} /> Study Planner
          </button>
        </div>
      </div>

      {activeTab === 'quiz' ? (
        <div className="space-y-8">
          {step === 1 && (
            <div className={cn(
              "p-8 md:p-12 rounded-[2.5rem] border backdrop-blur-md shadow-2xl transition-all",
              theme === 'dark' ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200"
            )}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>Upload Study Material</h2>
                  <p className="text-sm text-slate-500">Paste your notes or study content to generate a custom quiz.</p>
                </div>
              </div>

              <textarea 
                rows={10}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your notes, textbook excerpts, or study material here..."
                className={cn(
                  "w-full border rounded-[2rem] p-8 outline-none focus:ring-2 ring-blue-500 transition-all resize-none text-lg leading-relaxed",
                  theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50/50 border-blue-100 text-slate-900"
                )}
              />
              
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-slate-500 hover:text-blue-500 flex items-center gap-2 text-sm font-bold transition-all group"
                  >
                    <div className="p-2 bg-slate-500/10 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                      <Upload size={18} />
                    </div>
                    {fileName ? "Change File" : "Upload PDF / Image"}
                  </button>
                  {fileName && (
                    <div className="flex items-center gap-2 text-xs text-blue-500 font-bold bg-blue-500/10 px-3 py-1 rounded-full">
                      <FileUp size={12} /> {fileName}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleGenerateQuiz}
                  disabled={(!notes.trim() && !selectedFile) || loading}
                  className={cn(
                    "w-full md:w-auto px-12 py-4 rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-3",
                    theme === 'dark' ? "bg-white text-black hover:bg-blue-400" : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20",
                    ((!notes.trim() && !selectedFile) || loading) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Analyzing Content...
                    </>
                  ) : (
                    <>
                      <Zap size={20} fill="currentColor" />
                      Generate 10-Question Quiz
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && quizResults.length > 0 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between">
                <h2 className={cn("text-2xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>Your Custom Quiz</h2>
                <button 
                  onClick={reset}
                  className="text-blue-500 font-bold text-sm hover:underline"
                >
                  Generate New Quiz
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {quizResults.map((q, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "p-8 rounded-3xl border transition-all",
                      theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500">Question {idx + 1}</span>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                        q.difficulty === 'Easy' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        q.difficulty === 'Medium' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {q.difficulty}
                      </span>
                    </div>
                    
                    <h3 className={cn("text-lg font-bold mb-6", theme === 'dark' ? "text-white" : "text-slate-900")}>{q.question}</h3>
                    
                    {q.type === 'MCQ' && q.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {q.options.map((opt, oIdx) => (
                          <div 
                            key={oIdx}
                            className={cn(
                              "p-4 rounded-2xl border text-sm transition-all",
                              theme === 'dark' ? "bg-white/5 border-white/5 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                            )}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className={cn(
                      "p-6 rounded-2xl border-l-4",
                      theme === 'dark' ? "bg-blue-500/5 border-blue-500/30" : "bg-blue-50 border-blue-500/30"
                    )}>
                      <p className={cn("text-sm font-bold mb-1", theme === 'dark' ? "text-blue-400" : "text-blue-600")}>Correct Answer:</p>
                      <p className={cn("text-sm mb-3", theme === 'dark' ? "text-white" : "text-slate-900")}>{q.answer}</p>
                      <p className="text-xs text-slate-500 italic"><Sparkles size={12} className="inline mr-1" /> {q.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {step === 1 && (
            <div className={cn(
              "p-8 md:p-12 rounded-[2.5rem] border backdrop-blur-md shadow-2xl transition-all",
              theme === 'dark' ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200"
            )}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                  <Calendar size={24} />
                </div>
                <div>
                  <h2 className={cn("text-xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>Study Planner</h2>
                  <p className="text-sm text-slate-500">Break down your assignments into manageable Pomodoro sessions.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Link to Assignment</label>
                    <div className="space-y-3">
                      {pendingAssignments.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {pendingAssignments.map(a => (
                            <button
                              key={a.id}
                              onClick={() => { setSelectedAssignmentId(a.id); setCustomAssignmentName(''); }}
                              className={cn(
                                "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                                selectedAssignmentId === a.id
                                  ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                                  : (theme === 'dark' ? "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:shadow-md")
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <AlertCircle size={16} className={selectedAssignmentId === a.id ? "text-blue-200" : "text-blue-500"} />
                                <span className="text-sm font-bold truncate max-w-[200px]">{a.title}</span>
                              </div>
                              <span className="text-[10px] opacity-70 font-bold uppercase">{a.dueDate}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No pending assignments found.</p>
                      )}
                      
                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/5"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400"><span className="bg-white dark:bg-[#0f172a] px-2">Or enter manually</span></div>
                      </div>

                      <input 
                        type="text"
                        value={customAssignmentName}
                        onChange={(e) => { setCustomAssignmentName(e.target.value); setSelectedAssignmentId(''); }}
                        placeholder="Assignment name..."
                        className={cn(
                          "w-full border rounded-2xl p-4 outline-none focus:ring-2 ring-blue-500 transition-all font-bold",
                          theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50/50 border-blue-100 text-slate-900"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 block">Estimated Time (Hours)</label>
                    <div className="flex items-center gap-6">
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        step="0.5"
                        value={estimatedHours}
                        onChange={(e) => setEstimatedHours(parseFloat(e.target.value))}
                        className="flex-1 accent-blue-600"
                      />
                      <span className={cn(
                        "text-3xl font-black w-20 text-center",
                        theme === 'dark' ? "text-white" : "text-slate-900"
                      )}>{estimatedHours}h</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 mt-2 uppercase tracking-widest">
                      <span>Quick Task</span>
                      <span>Deep Work</span>
                    </div>
                  </div>

                  <div className={cn(
                    "p-6 rounded-3xl border bg-gradient-to-br",
                    theme === 'dark' ? "from-indigo-900/20 to-transparent border-indigo-500/20" : "from-indigo-50 to-white border-indigo-100"
                  )}>
                    <h4 className={cn("text-sm font-bold mb-2 flex items-center gap-2", theme === 'dark' ? "text-indigo-300" : "text-indigo-600")}>
                      <Zap size={14} /> Pomodoro Strategy
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      We'll generate a plan with 25m study blocks and 5m breaks. Every 4 cycles, you'll get a longer 20m break to stay fresh.
                    </p>
                  </div>

                  <button 
                    onClick={handleGeneratePlan}
                    disabled={(!selectedAssignmentId && !customAssignmentName.trim()) || loading}
                    className={cn(
                      "w-full py-5 rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-3 text-lg",
                      theme === 'dark' ? "bg-white text-black hover:bg-indigo-400" : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20",
                      ((!selectedAssignmentId && !customAssignmentName.trim()) || loading) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Calculating Schedule...
                      </>
                    ) : (
                      <>
                        <BrainCircuit size={20} />
                        Generate Study Plan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && studyPlan && (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className={cn("text-2xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>Study Plan: {studyPlan.assignmentName}</h2>
                  <p className="text-slate-500 text-sm">Total focused time: {studyPlan.totalTime} minutes</p>
                </div>
                <button 
                  onClick={reset}
                  className="text-indigo-500 font-bold text-sm hover:underline self-start"
                >
                  Create New Plan
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 dark:bg-white/5" />
                
                <div className="space-y-6">
                  {studyPlan.sessions.map((session, idx) => (
                    <div key={idx} className="relative pl-16">
                      <div className={cn(
                        "absolute left-3 w-6 h-6 rounded-full border-4 flex items-center justify-center z-10",
                        session.type === 'Study' 
                          ? (theme === 'dark' ? "bg-indigo-600 border-slate-900" : "bg-indigo-600 border-white")
                          : (theme === 'dark' ? "bg-green-500 border-slate-900" : "bg-green-500 border-white")
                      )}>
                        {session.type === 'Study' ? <Clock size={10} className="text-white" /> : <Coffee size={10} className="text-white" />}
                      </div>
                      
                      <div className={cn(
                        "p-6 rounded-3xl border transition-all",
                        theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
                      )}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "text-xs font-black uppercase tracking-widest",
                              session.type === 'Study' ? "text-indigo-500" : "text-green-500"
                            )}>{session.type} Session</span>
                            <span className="text-[10px] text-slate-500 font-bold">{session.duration} mins</span>
                          </div>
                          <span className="text-xs font-bold text-slate-400">{session.time}</span>
                        </div>
                        
                        <h4 className={cn("font-bold mb-2", theme === 'dark' ? "text-white" : "text-slate-900")}>{session.task}</h4>
                        
                        {session.tip && (
                          <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <Sparkles size={14} className="text-blue-400 mt-0.5" />
                            <p className="text-xs text-slate-500 italic">{session.tip}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cn(
                "p-8 rounded-[2rem] border text-center",
                theme === 'dark' ? "bg-indigo-600/10 border-indigo-500/20" : "bg-indigo-50 border-indigo-200"
              )}>
                <CheckCircle2 size={32} className="text-indigo-500 mx-auto mb-4" />
                <h3 className={cn("text-xl font-bold mb-2", theme === 'dark' ? "text-white" : "text-slate-900")}>Ready to start?</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">Stick to the schedule and take your breaks seriously. You've got this!</p>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20">
                  Start First Session
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
