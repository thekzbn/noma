"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import {
  type Space,
  type SpaceType,
  DEMO_SPACES,
  DEMO_CAMPAIGN,
} from "./demo-data";

// ---- Types ----

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export interface AppState {
  user: AuthUser | null;
  spaces: Space[];
  toasts: ToastMessage[];
  onboardingDone: boolean;
}

type Action =
  | { type: "SIGN_IN"; payload: AuthUser }
  | { type: "SIGN_OUT" }
  | { type: "ADD_SPACE"; payload: Space }
  | { type: "UPDATE_SPACE"; payload: Space }
  | { type: "SHOW_TOAST"; payload: ToastMessage }
  | { type: "DISMISS_TOAST"; payload: string }
  | { type: "COMPLETE_ONBOARDING" };

// ---- Initial state ----

const initialState: AppState = {
  user: null,
  spaces: [...DEMO_SPACES, DEMO_CAMPAIGN],
  toasts: [],
  onboardingDone: false,
};

// ---- Reducer ----

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SIGN_IN":
      return { ...state, user: action.payload };
    case "SIGN_OUT":
      return { ...state, user: null, onboardingDone: false };
    case "ADD_SPACE":
      return { ...state, spaces: [...state.spaces, action.payload] };
    case "UPDATE_SPACE":
      return {
        ...state,
        spaces: state.spaces.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case "SHOW_TOAST":
      return { ...state, toasts: [...state.toasts, action.payload] };
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };
    case "COMPLETE_ONBOARDING":
      return { ...state, onboardingDone: true };
    default:
      return state;
  }
}

// ---- Context ----

interface AppContextValue {
  state: AppState;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
  addSpace: (space: Space) => void;
  updateSpace: (space: Space) => void;
  showToast: (message: string, type?: ToastMessage["type"]) => void;
  dismissToast: (id: string) => void;
  completeOnboarding: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const signIn = useCallback((user: AuthUser) => {
    dispatch({ type: "SIGN_IN", payload: user });
  }, []);

  const signOut = useCallback(() => {
    dispatch({ type: "SIGN_OUT" });
  }, []);

  const addSpace = useCallback((space: Space) => {
    dispatch({ type: "ADD_SPACE", payload: space });
  }, []);

  const updateSpace = useCallback((space: Space) => {
    dispatch({ type: "UPDATE_SPACE", payload: space });
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastMessage["type"] = "info") => {
      const id = Math.random().toString(36).slice(2);
      dispatch({ type: "SHOW_TOAST", payload: { id, message, type } });
      setTimeout(() => {
        dispatch({ type: "DISMISS_TOAST", payload: id });
      }, 4500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: "DISMISS_TOAST", payload: id });
  }, []);

  const completeOnboarding = useCallback(() => {
    dispatch({ type: "COMPLETE_ONBOARDING" });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        signIn,
        signOut,
        addSpace,
        updateSpace,
        showToast,
        dismissToast,
        completeOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// Convenience hooks
export function useAuth() {
  const { state, signIn, signOut } = useApp();
  return { user: state.user, signIn, signOut };
}

export function useSpaces() {
  const { state, addSpace, updateSpace } = useApp();
  return { spaces: state.spaces, addSpace, updateSpace };
}

export function useToasts() {
  const { state, showToast, dismissToast } = useApp();
  return { toasts: state.toasts, showToast, dismissToast };
}

// ID generator for new spaces
export function generateSpaceId(): string {
  return `space-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export type { SpaceType };
