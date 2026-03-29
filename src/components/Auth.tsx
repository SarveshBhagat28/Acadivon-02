import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useStore } from '../store/useStore';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { cn } from '../lib/utils';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser, theme } = useStore();

  const validatePassword = (pass: string) => {
    // 6 digits + 1 symbol
    const digitCount = (pass.match(/\d/g) || []).length;
    const symbolCount = (pass.match(/[^a-zA-Z0-9]/g) || []).length;
    return digitCount >= 6 && symbolCount >= 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          setUser({
            uid: userCredential.user.uid,
            email: userCredential.user.email!,
            username: userDoc.data().username
          });
        }
      } else {
        if (!validatePassword(password)) {
          throw new Error('Password must contain at least 6 digits and 1 symbol.');
        }
        if (!username.trim()) {
          throw new Error('Username is required.');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
        
        // Create user doc in Firestore
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            email,
            username,
            createdAt: new Date().toISOString()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${userCredential.user.uid}`);
        }

        setUser({
          uid: userCredential.user.uid,
          email,
          username
        });
      }
    } catch (err: any) {
      console.error(err);
      let message = 'An error occurred during authentication.';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already registered. Try logging in instead.';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          message = 'The password is too weak. Please use a stronger password.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          message = 'Invalid email or password. Please try again.';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your internet connection.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many failed attempts. Please try again later.';
          break;
        default:
          message = err.message || message;
      }
      
      setError(message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500",
      theme === 'dark' ? "bg-[#020617]" : "bg-blue-50"
    )}>
      {/* Background Glows */}
      <div className={cn(
        "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full",
        theme === 'dark' ? "bg-blue-600/10" : "bg-blue-400/20"
      )} />
      <div className={cn(
        "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full",
        theme === 'dark' ? "bg-indigo-600/10" : "bg-indigo-400/20"
      )} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "w-full max-w-md p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative z-10 border transition-all duration-500",
          theme === 'dark' ? "bg-slate-900/40 border-white/5" : "bg-white/80 border-blue-100"
        )}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
            <ShieldCheck className="text-blue-500" size={32} />
          </div>
          <h1 className={cn(
            "text-3xl font-black tracking-tight",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {isLogin ? 'Welcome Back' : 'Join Acadivon'}
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {isLogin ? 'Enter your credentials to access your dashboard' : 'Create an account to start your academic journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1"
              >
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={cn(
                      "w-full border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 ring-blue-500/50 transition-all",
                      theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50/50 border-blue-100 text-slate-900"
                    )}
                    placeholder="Choose a username"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 ring-blue-500/50 transition-all",
                  theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50/50 border-blue-100 text-slate-900"
                )}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "w-full border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 ring-blue-500/50 transition-all",
                  theme === 'dark' ? "bg-white/5 border-white/10 text-white" : "bg-blue-50/50 border-blue-100 text-slate-900"
                )}
                placeholder="••••••••"
              />
            </div>
            {!isLogin && (
              <p className="text-[10px] text-slate-500 ml-2 mt-1">
                Must contain at least 6 digits and 1 symbol.
              </p>
            )}
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3"
            >
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-red-400 leading-relaxed">{error}</p>
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={cn(
              "w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg mt-4",
              theme === 'dark' ? "shadow-blue-900/40" : "shadow-blue-500/20"
            )}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className={cn(
              "text-sm transition-colors",
              theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
            )}
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-blue-400 font-bold">{isLogin ? 'Sign Up' : 'Log In'}</span>
          </button>
        </div>
      </motion.div>

      {/* ERROR MODAL POPUP */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowErrorModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={cn(
                "w-full max-w-sm p-8 rounded-[2rem] shadow-2xl border relative",
                theme === 'dark' ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                  <AlertCircle className="text-red-500" size={32} />
                </div>
                <h2 className={cn(
                  "text-xl font-bold",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>Authentication Failed</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {error}
                </p>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all mt-2"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
