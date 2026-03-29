import React, { useState, useEffect } from 'react';
import { Plus, Clock, Calendar, AlertCircle, CheckCircle2, MoreVertical, X, Trash2 } from 'lucide-react';
import { useStore, Assignment } from '@/src/store/useStore';
import { cn } from '@/src/lib/utils';

export default function Assignments() {
  const { user, assignments, addXP, fetchAssignments, addAssignment, updateAssignmentStatus, removeAssignment, theme } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '23:59',
    priority: 'Medium' as const
  });

  useEffect(() => {
    if (user) {
      fetchAssignments(user.uid);
    }
  }, [user, fetchAssignments]);

  const toggleComplete = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    if (newStatus === 'completed') addXP(10);
    await updateAssignmentStatus(id, newStatus as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAssignment(formData);
    setIsModalOpen(false);
    setFormData({ title: '', description: '', dueDate: '', dueTime: '23:59', priority: 'Medium' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={cn(
            "text-4xl font-bold tracking-tight",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>Assignments</h1>
          <p className="text-slate-400 mt-2">Manage your academic tasks and deadlines.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg",
            theme === 'dark' ? "shadow-blue-900/40" : "shadow-blue-500/20"
          )}
        >
          <Plus size={20} /> Create Assignment
        </button>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={cn(
            "border w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200",
            theme === 'dark' ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"
          )}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={cn(
                "text-2xl font-bold",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>New Assignment</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className={cn(
                  "transition-colors",
                  theme === 'dark' ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900"
                )}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Heading</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Quantum Physics Lab Report"
                  className={cn(
                    "w-full border rounded-2xl p-4 outline-none focus:ring-2 ring-blue-500 transition-all",
                    theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50 border-blue-100 text-slate-900"
                  )}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="What needs to be done?"
                  className={cn(
                    "w-full border rounded-2xl p-4 outline-none focus:ring-2 ring-blue-500 transition-all resize-none",
                    theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50 border-blue-100 text-slate-900"
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Deadline Date</label>
                  <input 
                    required
                    type="date" 
                    value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                    className={cn(
                      "w-full border rounded-2xl p-4 outline-none focus:ring-2 ring-blue-500 transition-all",
                      theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50 border-blue-100 text-slate-900"
                    )}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value as any})}
                    className={cn(
                      "w-full border rounded-2xl p-4 outline-none focus:ring-2 ring-blue-500 transition-all appearance-none",
                      theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50 border-blue-100 text-slate-900"
                    )}
                  >
                    <option value="High" className={theme === 'dark' ? "bg-slate-900" : "bg-white"}>High</option>
                    <option value="Medium" className={theme === 'dark' ? "bg-slate-900" : "bg-white"}>Medium</option>
                    <option value="Low" className={theme === 'dark' ? "bg-slate-900" : "bg-white"}>Low</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className={cn(
                  "w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg mt-4",
                  theme === 'dark' ? "shadow-blue-900/40" : "shadow-blue-500/20"
                )}
              >
                Create Assignment
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div 
            key={assignment.id}
            className={cn(
              "p-6 rounded-3xl backdrop-blur-sm transition-all group relative overflow-hidden border",
              theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm",
              assignment.status === 'completed' ? "opacity-60" : "hover:border-blue-500/30"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                assignment.priority === 'High' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                assignment.priority === 'Medium' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                "bg-slate-500/10 text-slate-500 border border-slate-500/20"
              )}>
                {assignment.priority} Priority
              </div>
              <button 
                onClick={() => removeAssignment(assignment.id)}
                className="text-slate-600 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <h3 className={cn(
              "text-lg font-bold mb-2",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>{assignment.title}</h3>
            <p className="text-sm text-slate-400 mb-6 line-clamp-2">{assignment.description}</p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={14} />
                <span>Due: {assignment.dueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock size={14} />
                <span>Time: {assignment.dueTime}</span>
              </div>
              {assignment.status === 'overdue' && (
                <div className="flex items-center gap-2 text-xs text-red-500 font-bold">
                  <AlertCircle size={14} />
                  <span>Overdue</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => toggleComplete(assignment.id, assignment.status)}
              className={cn(
                "w-full py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 border",
                assignment.status === 'completed' 
                  ? "bg-green-500/10 text-green-500 border-green-500/20" 
                  : (theme === 'dark' 
                      ? "bg-white/5 hover:bg-white/10 text-white border-white/10" 
                      : "bg-blue-50 hover:bg-blue-100 text-slate-900 border-blue-100")
              )}
            >
              {assignment.status === 'completed' ? (
                <><CheckCircle2 size={18} /> Completed</>
              ) : (
                "Mark as Complete (+10 XP)"
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
