import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getItem, setItem, deleteItemAsync } from "expo-secure-store";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type UserState = {
    isLoggedIn: boolean;
    authLoading: boolean;

    hasCompletedOnboarding: boolean;
    completeOnboarding: () => void;
    resetOnboarding: () => void;

    session: Session | null;
    setSession: (session: Session | null) => void;

    signInError: string | null;
    signUpError: string | null;
    signOutError: string | null;

    tempSignIn: () => void;
    tempSignUp: () => void;

    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};

export const useAuthStore = create(
    persist<UserState>(
        (set, get) => ({
            isLoggedIn: false,
            authLoading: false,

            hasCompletedOnboarding: false,
            completeOnboarding: () => {
                set({ hasCompletedOnboarding: true });
            },
            resetOnboarding: () => {
                set({ hasCompletedOnboarding: false });
            },

            session: null,
            setSession: (session: Session | null) => {
                set({ session });
            },

            signInError: null,
            signUpError: null,
            signOutError: null,

            tempSignIn: () => {
                set({ isLoggedIn: true });
            },
            tempSignUp: () => {
                set({ isLoggedIn: true });
            },

            signInWithEmail: async (email, password) => {
                set({ authLoading: true, signInError: null });
                const { error, data } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) {
                    set({ signInError: error.message, authLoading: false });
                } else {
                    set({
                        session: data.session,
                        isLoggedIn: !!data.session,
                        authLoading: false,
                        signInError: null,
                    });
                }
            },
            signUpWithEmail: async (email, password) => {
                set({ authLoading: true, signUpError: null });
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) {
                    set({ signUpError: error.message, authLoading: false });
                } else {
                    set({
                        session: data.session,
                        isLoggedIn: !!data.session,
                        authLoading: false,
                        signUpError: null,
                    });
                    if (!data.session) {
                        set({
                            signUpError: "이메일 인증 후 로그인해주세요.",
                            authLoading: false,
                        });
                    }
                }
            },
            signOut: async () => {
                set({ authLoading: true, signOutError: null });
                const { error } = await supabase.auth.signOut();
                if (error) {
                    set({ signOutError: error.message, authLoading: false });
                } else {
                    set({
                        isLoggedIn: false,
                        session: null,
                        signOutError: null,
                        authLoading: false,
                    });
                }
            },
        }),
        {
            name: "auth-store",
            storage: createJSONStorage(() => ({
                setItem,
                getItem,
                removeItem: deleteItemAsync,
            })),
        }
    )
);

export const clearAuthStore = async () => {
    await deleteItemAsync("auth-store");
    console.log("Auth store cleared");
};
