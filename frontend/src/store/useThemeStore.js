import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("stream-flix-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("stream-flix-theme", theme);
        set({ theme });
    },
}));
