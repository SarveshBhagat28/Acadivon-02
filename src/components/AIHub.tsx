import React, { useState } from 'react';
import { Brain, Upload, Settings, Play, BrainCircuit, Settings2 } from 'lucide-react';
import { useStore } from '@/src/store/useStore';
import { cn } from '@/src/lib/utils';
import { generateQuizFromContent } from '@/src/services/geminiService';

export default function AIHub() {
  const { addXP, theme } = useStore();
  const [step, setStep] = useState(1);
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);

  // Mock extracted topics
  const topics = ["Linear Algebra", "Matrix Multiplication", "Eigenvalues", "Vector Spaces"];

  const generateQuiz = async () => {
    setLoading(true);
    try {
      // In a real app, we'd pass actual content here
      const mockContent = "Quantum physics is the study of matter and energy at the most fundamental level. It aims to uncover the properties and behaviors of the very building blocks of nature.";
      await generateQuizFromContent(mockContent, difficulty, numQuestions);
      setStep(3);
      addXP(10);
    } catch (error) {
      console.error("Quiz Generation Error:", error);
      // Fallback for demo
      await new Promise(r => setTimeout(r, 2000));
      setStep(3);
      addXP(10);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className={cn(
            "text-4xl font-bold tracking-tight",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>AI Hub</h1>
          <p className="text-slate-400 mt-2">Generate deep-learning assessments from your notes.</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full text-xs font-bold text-blue-400 uppercase">
          Model: c4ai-aya-expanse-32b
        </div>
      </div>

      {step === 1 && (
        <div 
          onClick={() => setStep(2)}
          className={cn(
            "p-20 rounded-3xl text-center border-dashed hover:border-blue-500/50 transition-all group cursor-pointer border",
            theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
          )}
        >
          <Upload className="mx-auto mb-4 text-slate-600 group-hover:text-blue-400 group-hover:-translate-y-1 transition-all" size={54} />
          <h2 className={cn(
            "text-2xl font-bold",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>Upload Study Material</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">PDFs, Images, or Notes. Acadivon AI will extract the core concepts automatically.</p>
          <button className={cn(
            "px-8 py-3 rounded-xl font-bold transition-all shadow-lg",
            theme === 'dark' ? "bg-white text-black hover:bg-blue-400" : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20"
          )}>
            Browse Files
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className={cn(
              "p-8 rounded-3xl border backdrop-blur-md shadow-2xl",
              theme === 'dark' ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200"
            )}>
              <h3 className={cn(
                "text-lg font-bold mb-4 flex items-center gap-2",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>
                <Brain className="text-blue-400" size={20} /> Detected Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {topics.map(t => (
                  <button key={t} className={cn(
                    "px-4 py-2 border rounded-xl text-sm font-medium transition-all",
                    theme === 'dark' 
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500 hover:text-white" 
                      : "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white"
                  )}>
                    {t}
                  </button>
                ))}
                <button className={cn(
                  "px-4 py-2 border rounded-xl text-sm font-bold",
                  theme === 'dark' ? "bg-blue-600/20 border-blue-500/50 text-blue-400" : "bg-blue-600 border-blue-700 text-white"
                )}>
                  All Content
                </button>
              </div>
            </div>

            <div className={cn(
              "p-8 rounded-3xl border backdrop-blur-md shadow-2xl",
              theme === 'dark' ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200"
            )}>
              <h3 className={cn(
                "text-lg font-bold mb-6 flex items-center gap-2",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>
                <Settings2 className="text-blue-400" size={20} /> Quiz Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Difficulty Level</label>
                  <div className={cn(
                    "flex p-1 rounded-2xl border mt-3",
                    theme === 'dark' ? "bg-slate-800 border-white/5" : "bg-blue-50 border-blue-100"
                  )}>
                    {['Easy', 'Medium', 'Hard'].map(d => (
                      <button 
                        key={d} 
                        onClick={() => setDifficulty(d)}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
                          difficulty === d 
                            ? (theme === 'dark' ? "bg-blue-600 text-white shadow-lg" : "bg-white text-blue-600 shadow-sm") 
                            : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Question Count (Max 20)</label>
                  <input 
                    type="number" 
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    className={cn(
                      "w-full mt-3 border rounded-2xl p-3 outline-none focus:ring-2 ring-blue-500 transition-all font-bold",
                      theme === 'dark' ? "bg-slate-800 border-white/5 text-white" : "bg-blue-50 border-blue-100 text-slate-900"
                    )} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-blue-600 to-indigo-700 p-8 rounded-3xl flex flex-col justify-between shadow-2xl shadow-blue-900/20">
            <div>
              <h4 className="text-2xl font-bold text-white">Ready to Excel?</h4>
              <p className="text-blue-100/70 mt-2 text-sm">Our AI will generate questions exclusively from your uploaded content.</p>
            </div>
            <button 
              disabled={loading}
              onClick={generateQuiz} 
              className="w-full bg-white text-blue-900 py-4 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : <><Play fill="currentColor" size={20}/> Start Quiz</>}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={cn(
          "p-12 rounded-3xl border text-center space-y-6",
          theme === 'dark' ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200 shadow-lg"
        )}>
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
            <Play size={40} fill="currentColor" />
          </div>
          <h2 className={cn(
            "text-3xl font-bold",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>Quiz Generated!</h2>
          <p className="text-slate-400 max-w-md mx-auto">Your custom assessment on {difficulty} difficulty is ready. Good luck!</p>
          <button 
            onClick={() => setStep(1)}
            className={cn(
              "px-10 py-4 rounded-2xl font-bold transition-all shadow-lg",
              theme === 'dark' ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40" : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
            )}
          >
            Take Quiz Now
          </button>
        </div>
      )}
    </div>
  );
}
