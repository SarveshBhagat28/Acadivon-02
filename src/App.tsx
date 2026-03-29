/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AIHub from './components/AIHub';
import Assignments from './components/Assignments';
import FocusMode from './components/FocusMode';
import Timetable from './components/Timetable';
import Auth from './components/Auth';
import Community from './components/Community';
import StudyRooms from './components/StudyRooms';
import Settings from './components/Settings';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useStore } from './store/useStore';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, setUser, theme, resetStats, statsReset, setStreak, streak } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.username.toLowerCase() === 'sarvesh') {
      if (!statsReset) {
        resetStats();
        setStreak(7);
      } else if (streak < 7) {
        setStreak(7);
      }
    }
  }, [user, statsReset, resetStats, setStreak, streak]);

  useEffect(() => {
    // Fallback timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth state listener timed out, setting loading to false');
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              username: userDoc.data().username
            });
          } else {
            // User exists in Auth but not in Firestore
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [setUser, loading]);

  if (loading) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center transition-colors duration-500",
        theme === 'dark' ? "bg-[#020617]" : "bg-blue-50"
      )}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <p className={cn(
            "text-sm font-medium animate-pulse",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>Loading Acadivon...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'ai-hub':
        return <AIHub />;
      case 'assignments':
        return <Assignments />;
      case 'focus':
        return <FocusMode />;
      case 'timetable':
        return <Timetable />;
      case 'rooms':
        return <StudyRooms />;
      case 'community':
        return <Community />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className={cn(
            "flex flex-col items-center justify-center h-full space-y-4",
            theme === 'dark' ? "text-slate-500" : "text-slate-400"
          )}>
            <div className={cn(
              "p-6 rounded-full border",
              theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
            )}>
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className={cn(
              "text-xl font-bold uppercase tracking-widest",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>Under Construction</h2>
            <p className="text-sm">The {activeTab} feature is coming soon to Acadivon.</p>
          </div>
        );
    }
  };

  return (
    <div className={cn(
      "flex h-screen font-sans overflow-hidden transition-colors duration-500",
      theme === 'dark' ? "bg-[#020617] text-slate-100" : "bg-blue-50 text-slate-900"
    )}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden relative",
        theme === 'dark' 
          ? "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]" 
          : "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-white"
      )}>
        <Header onNavigate={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative z-10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
