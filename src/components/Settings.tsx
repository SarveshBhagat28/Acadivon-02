import React, { useState } from 'react';
import { User, Mail, Shield, Trash2, AlertTriangle, LogOut, Volume2, Moon, Sun, Monitor, RotateCcw } from 'lucide-react';
import { useStore } from '@/src/store/useStore';
import { auth } from '@/src/firebase';
import { deleteUser, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Settings() {
  const { user, setUser, deleteAccount, theme, setTheme, volume, setVolume, resetStats } = useStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;
    
    setIsDeleting(true);
    setDeleteError('');
    
    try {
      await deleteAccount();
      await deleteUser(auth.currentUser);
    } catch (error: any) {
      console.error('Delete account error:', error);
      if (error.code === 'auth/requires-recent-login') {
        setDeleteError('For security reasons, you must have logged in recently to delete your account. Please log out and log back in, then try again.');
      } else {
        setDeleteError('An error occurred while deleting your account. Please try again later.');
      }
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className={cn(
          "text-4xl font-bold tracking-tight",
          theme === 'dark' ? "text-white" : "text-slate-900"
        )}>Settings</h1>
        <p className="text-slate-400 mt-2">Manage your profile and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* PROFILE SECTION */}
        <div className={cn(
          "border p-8 rounded-[2.5rem] backdrop-blur-sm space-y-8 transition-colors",
          theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="flex items-center gap-6">
            <div className={cn(
              "size-20 rounded-3xl flex items-center justify-center text-3xl font-bold border",
              theme === 'dark' ? "bg-blue-600/20 text-blue-400 border-blue-500/20" : "bg-blue-600 text-white border-blue-700 shadow-lg shadow-blue-500/20"
            )}>
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <h2 className={cn(
                "text-2xl font-bold",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>{user.username}</h2>
              <p className="text-slate-500 text-sm">Student Account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Username</label>
              <div className={cn(
                "flex items-center gap-3 border rounded-2xl p-4 transition-colors",
                theme === 'dark' ? "bg-white/5 border-white/10 text-slate-300" : "bg-blue-50 border-blue-100 text-slate-700"
              )}>
                <User size={18} className="text-slate-500" />
                <span>{user.username}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Email Address</label>
              <div className={cn(
                "flex items-center gap-3 border rounded-2xl p-4 transition-colors",
                theme === 'dark' ? "bg-white/5 border-white/10 text-slate-300" : "bg-blue-50 border-blue-100 text-slate-700"
              )}>
                <Mail size={18} className="text-slate-500" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* GENERAL SETTINGS */}
        <div className={cn(
          "border p-8 rounded-[2.5rem] backdrop-blur-sm space-y-8 transition-colors",
          theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
        )}>
          <h3 className={cn(
            "text-xl font-bold",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>General Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* THEME SELECTOR */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Appearance</label>
              <div className={cn(
                "grid grid-cols-2 gap-2 p-1.5 rounded-2xl border",
                theme === 'dark' ? "bg-white/5 border-white/10" : "bg-blue-50 border-blue-100"
              )}>
                <button 
                  onClick={() => setTheme('light')}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                    theme === 'light' 
                      ? "bg-white text-blue-600 shadow-md" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Sun size={16} /> Light
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                    theme === 'dark' 
                      ? "bg-slate-800 text-white shadow-md" 
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <Moon size={16} /> Dark
                </button>
              </div>
            </div>

            {/* VOLUME CONTROL */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">System Volume</label>
                <span className={cn(
                  "text-xs font-bold",
                  theme === 'dark' ? "text-blue-400" : "text-blue-600"
                )}>{volume}%</span>
              </div>
              <div className="flex items-center gap-4">
                <Volume2 size={20} className="text-slate-500" />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ACCOUNT ACTIONS */}
        <div className={cn(
          "border p-8 rounded-[2.5rem] backdrop-blur-sm flex flex-wrap gap-4 items-center justify-between transition-colors",
          theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="space-y-1">
            <h3 className={cn(
              "text-lg font-bold",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>Account Actions</h3>
            <p className="text-sm text-slate-500">Manage your session and security.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to reset your streak and level? This cannot be undone.')) {
                  resetStats();
                }
              }}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all",
                theme === 'dark' 
                  ? "bg-white/5 text-orange-400 hover:bg-white/10 hover:text-orange-300" 
                  : "bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700"
              )}
            >
              <RotateCcw size={18} />
              <span>Reset Stats</span>
            </button>
            <button 
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all",
                theme === 'dark' 
                  ? "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white" 
                  : "bg-blue-50 text-slate-600 hover:bg-blue-100 hover:text-slate-900"
              )}
            >
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className={cn(
          "border p-8 rounded-[2.5rem] space-y-6 transition-colors",
          theme === 'dark' ? "bg-red-500/5 border-red-500/10" : "bg-red-50 border-red-200"
        )}>
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle size={20} />
            <h3 className="font-bold uppercase tracking-widest text-xs">Danger Zone</h3>
          </div>
          
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
            Deleting your account is permanent. All your timetable data, assignments, and XP will be removed from our servers. This action cannot be reversed.
          </p>

          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
          >
            <Trash2 size={18} /> Delete Account Permanently
          </button>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "border w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl space-y-8",
                theme === 'dark' ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"
              )}
            >
              <div className="text-center space-y-4">
                <div className="size-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto">
                  <Trash2 size={40} />
                </div>
                <h2 className={cn(
                  "text-2xl font-bold",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>Are you absolutely sure?</h2>
                <p className="text-slate-500 text-sm">
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </p>
              </div>

              {deleteError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3 text-red-500 text-sm">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <p>{deleteError}</p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-red-900/40 flex items-center justify-center gap-2"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button 
                  onClick={() => { setIsDeleteModalOpen(false); setDeleteError(''); }}
                  disabled={isDeleting}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold transition-all",
                    theme === 'dark' ? "bg-white/5 text-white hover:bg-white/10" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
