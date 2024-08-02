import { create } from 'zustand';

// useAuthStore is a React hook
// The create function is going to create a central store inside our React application, so we can access a central store variable in any React component.
// The set function is used to set a new value to the store.
export const useAuthStore = create((set) => ({
    auth: {
        username: '',
    },
    setUsername: (name) => set((state) => ({
        auth: { ...state.auth, username: name }
    }))
}));
