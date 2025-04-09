import type { Task } from '@/types/task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type State = {
    tasks: Task[];
    loadTasks: () => Promise<void>;
    addTask: (task: Task) => void;
    updateTask: (task: Task) => void;
    deleteTask: (id: string) => void;
};

export const useTasksStore = create<State>((set) => ({
    tasks: [],
    loadTasks: async () => {
        const json = await AsyncStorage.getItem('TASKS');
        set({ tasks: json ? JSON.parse(json) : [] });
    },
    addTask: async (task) => {
        set((state) => {
            const tasks = [...state.tasks, task];
            AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
            return { tasks };
        });
    },
    updateTask: async (task) => {
        set((state) => {
            const tasks = state.tasks.map((t) => (t.id === task.id ? task : t));
            AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
            return { tasks };
        });
    },
    deleteTask: async (id) => {
        set((state) => {
            const tasks = state.tasks.filter((task) => task.id !== id);
            AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
            return { tasks };
        });
    },
}));
