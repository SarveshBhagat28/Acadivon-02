import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

export type Rank = 'Rookie' | 'Veteran' | 'Expert' | 'Legend';

export interface ClassSession {
  id: string;
  uid: string;
  name: string;
  day: string;
  time: string;
  status: 'present' | 'absent' | 'late' | 'cancelled' | 'pending';
}

interface User {
  uid: string;
  email: string;
  username: string;
}

export interface Assignment {
  id: string;
  uid: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'completed' | 'overdue';
}

interface UserState {
  user: User | null;
  xp: number;
  level: number;
  streak: number;
  rank: Rank;
  attendance: number;
  schedule: ClassSession[];
  assignments: Assignment[];
  setUser: (user: User | null) => void;
  addXP: (amount: number) => void;
  setSchedule: (schedule: ClassSession[]) => void;
  fetchSchedule: (uid: string) => Promise<void>;
  updateClassStatus: (id: string, status: ClassSession['status']) => Promise<void>;
  addClass: (session: Omit<ClassSession, 'id' | 'uid'>) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
  setAssignments: (assignments: Assignment[]) => void;
  fetchAssignments: (uid: string) => Promise<void>;
  addAssignment: (assignment: Omit<Assignment, 'id' | 'uid' | 'status'>) => Promise<void>;
  updateAssignmentStatus: (id: string, status: Assignment['status']) => Promise<void>;
  removeAssignment: (id: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  theme: 'dark' | 'light';
  volume: number;
  statsReset: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  setVolume: (volume: number) => void;
  resetStats: () => void;
}

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      xp: 0,
      level: 1,
      streak: 0,
      rank: 'Rookie',
      attendance: 0,
      schedule: [],
      assignments: [],
      theme: 'dark',
      volume: 80,
      statsReset: false,
      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      setVolume: (volume) => set({ volume }),
      resetStats: () => set({ xp: 0, level: 1, streak: 0, rank: 'Rookie', statsReset: true }),
      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          let newRank: Rank = 'Rookie';
          if (newLevel > 20) newRank = 'Legend';
          else if (newLevel > 10) newRank = 'Expert';
          else if (newLevel > 5) newRank = 'Veteran';

          return { xp: newXP, level: newLevel, rank: newRank };
        }),
      setSchedule: (newSchedule) => 
        set(() => {
          const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
          const TIMES = ["09:00", "11:00", "13:00", "15:00", "17:00"];
          const visibleSchedule = newSchedule.filter(s => DAYS.includes(s.day) && TIMES.includes(s.time));
          const attended = visibleSchedule.filter(s => s.status === 'present' || s.status === 'late').length;
          const total = visibleSchedule.filter(s => s.status !== 'pending' && s.status !== 'cancelled').length;
          const attendance = total === 0 ? 0 : Math.round((attended / total) * 100);
          
          return { schedule: newSchedule, attendance };
        }),
      fetchSchedule: async (uid) => {
        try {
          const q = query(collection(db, 'schedules'), where('uid', '==', uid));
          const querySnapshot = await getDocs(q);
          const schedule: ClassSession[] = [];
          querySnapshot.forEach((doc) => {
            schedule.push({ id: doc.id, ...doc.data() } as ClassSession);
          });
          get().setSchedule(schedule);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'schedules');
        }
      },
      updateClassStatus: async (id, status) => {
        try {
          const schedule = get().schedule;
          const newSchedule = schedule.map((s) =>
            s.id === id ? { ...s, status } : s
          );
          
          await updateDoc(doc(db, 'schedules', id), { status });
          get().setSchedule(newSchedule);
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `schedules/${id}`);
        }
      },
      addClass: async (session) => {
        const user = get().user;
        if (!user) return;

        const id = Math.random().toString(36).substr(2, 9);
        const newSession = { ...session, id, uid: user.uid };
        
        try {
          await setDoc(doc(db, 'schedules', id), newSession);
          get().setSchedule([...get().schedule, newSession]);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, `schedules/${id}`);
        }
      },
      removeClass: async (id) => {
        try {
          await deleteDoc(doc(db, 'schedules', id));
          get().setSchedule(get().schedule.filter((s) => s.id !== id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `schedules/${id}`);
        }
      },
      setAssignments: (assignments) => set({ assignments }),
      fetchAssignments: async (uid) => {
        try {
          const q = query(collection(db, 'assignments'), where('uid', '==', uid));
          const querySnapshot = await getDocs(q);
          const assignments: Assignment[] = [];
          querySnapshot.forEach((doc) => {
            assignments.push({ id: doc.id, ...doc.data() } as Assignment);
          });
          set({ assignments });
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'assignments');
        }
      },
      addAssignment: async (assignment) => {
        const user = get().user;
        if (!user) return;

        const id = Math.random().toString(36).substr(2, 9);
        const newAssignment = { ...assignment, id, uid: user.uid, status: 'pending' as const };
        
        try {
          await setDoc(doc(db, 'assignments', id), newAssignment);
          set((state) => ({ assignments: [newAssignment, ...state.assignments] }));
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, `assignments/${id}`);
        }
      },
      updateAssignmentStatus: async (id, status) => {
        try {
          await updateDoc(doc(db, 'assignments', id), { status });
          set((state) => ({
            assignments: state.assignments.map((a) => (a.id === id ? { ...a, status } : a)),
          }));
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `assignments/${id}`);
        }
      },
      removeAssignment: async (id) => {
        try {
          await deleteDoc(doc(db, 'assignments', id));
          set((state) => ({
            assignments: state.assignments.filter((a) => a.id !== id),
          }));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `assignments/${id}`);
        }
      },
      deleteAccount: async () => {
        const user = get().user;
        if (!user) return;

        try {
          // Delete assignments
          const assignmentsQ = query(collection(db, 'assignments'), where('uid', '==', user.uid));
          const assignmentsSnapshot = await getDocs(assignmentsQ);
          const assignmentDeletions = assignmentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
          
          // Delete schedule
          const scheduleQ = query(collection(db, 'schedules'), where('uid', '==', user.uid));
          const scheduleSnapshot = await getDocs(scheduleQ);
          const scheduleDeletions = scheduleSnapshot.docs.map(doc => deleteDoc(doc.ref));

          // Delete user doc
          const userDeletion = deleteDoc(doc(db, 'users', user.uid));

          await Promise.all([...assignmentDeletions, ...scheduleDeletions, userDeletion]);
          
          set({ user: null, schedule: [], assignments: [], xp: 0, level: 1, rank: 'Rookie', attendance: 0 });
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}`);
        }
      },
    }),
    {
      name: 'acadivon-storage',
    }
  )
);
