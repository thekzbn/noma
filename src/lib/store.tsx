"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  type Space,
  type SpaceType,
  type Transaction,
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
  onboardingSelectedTypes?: string[];
}

type Action =
  | { type: "INIT_STATE"; payload: Partial<AppState> }
  | { type: "SIGN_IN"; payload: AuthUser }
  | { type: "SIGN_OUT" }
  | { type: "ADD_SPACE"; payload: Space }
  | { type: "UPDATE_SPACE"; payload: Space }
  | {
      type: "APPROVE_PAYOUT";
      payload: { spaceId: string; payoutId: string; approverName: string };
    }
  | {
      type: "REJECT_PAYOUT";
      payload: { spaceId: string; payoutId: string };
    }
  | { type: "SHOW_TOAST"; payload: ToastMessage }
  | { type: "DISMISS_TOAST"; payload: string }
  | { type: "COMPLETE_ONBOARDING"; payload?: { selectedTypes?: string[] } };

// ---- Initial state ----

const STORAGE_KEY = "noma_app_state_v1";

const defaultInitialState: AppState = {
  user: null,
  spaces: [...DEMO_SPACES, DEMO_CAMPAIGN],
  toasts: [],
  onboardingDone: false,
  onboardingSelectedTypes: ["personal"],
};

// ---- Reducer ----

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "INIT_STATE":
      return {
        ...state,
        ...action.payload,
        toasts: [], // Don't restore transient toasts
      };
    case "SIGN_IN":
      return { ...state, user: action.payload };
    case "SIGN_OUT":
      return { ...state, user: null, onboardingDone: false };
    case "ADD_SPACE":
      return { ...state, spaces: [action.payload, ...state.spaces] };
    case "UPDATE_SPACE":
      return {
        ...state,
        spaces: state.spaces.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case "APPROVE_PAYOUT": {
      const { spaceId, payoutId, approverName } = action.payload;
      return {
        ...state,
        spaces: state.spaces.map((space) => {
          if (space.id !== spaceId) return space;
          const targetPayout = space.payoutRequests.find((p) => p.id === payoutId);
          if (!targetPayout || targetPayout.status !== "pending") return space;

          const alreadyApproved = targetPayout.approvalsReceived.includes(approverName);
          const approvals = alreadyApproved
            ? targetPayout.approvalsReceived
            : [...targetPayout.approvalsReceived, approverName];
          const isApproved = approvals.length >= targetPayout.approvalsRequired;

          const updatedPayouts = space.payoutRequests.map((p) =>
            p.id === payoutId
              ? {
                  ...p,
                  approvalsReceived: approvals,
                  status: isApproved ? ("approved" as const) : p.status,
                }
              : p
          );

          if (isApproved) {
            const payoutTx: Transaction = {
              id: `tx-${Date.now()}`,
              date: new Date().toISOString().slice(0, 10),
              type: "payout",
              amount: targetPayout.amount,
              currency: targetPayout.currency,
              status: "completed",
              memberName: targetPayout.requestedBy,
              note: `Payout to ${targetPayout.destination}: ${targetPayout.reason}`,
              reference: `NMA-PO-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
            };
            return {
              ...space,
              savedAmount: Math.max(0, space.savedAmount - targetPayout.amount),
              payoutRequests: updatedPayouts,
              transactions: [...space.transactions, payoutTx],
            };
          }

          return {
            ...space,
            payoutRequests: updatedPayouts,
          };
        }),
      };
    }
    case "REJECT_PAYOUT": {
      const { spaceId, payoutId } = action.payload;
      return {
        ...state,
        spaces: state.spaces.map((space) => {
          if (space.id !== spaceId) return space;
          return {
            ...space,
            payoutRequests: space.payoutRequests.map((p) =>
              p.id === payoutId ? { ...p, status: "rejected" as const } : p
            ),
          };
        }),
      };
    }
    case "SHOW_TOAST":
      return { ...state, toasts: [...state.toasts, action.payload] };
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };
    case "COMPLETE_ONBOARDING":
      return {
        ...state,
        onboardingDone: true,
        ...(action.payload?.selectedTypes
          ? { onboardingSelectedTypes: action.payload.selectedTypes }
          : {}),
      };
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
  approvePayout: (spaceId: string, payoutId: string, approverName: string) => void;
  rejectPayout: (spaceId: string, payoutId: string) => void;
  showToast: (message: string, type?: ToastMessage["type"]) => void;
  dismissToast: (id: string) => void;
  completeOnboarding: (selectedTypes?: string[]) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultInitialState);

  // Restore persisted state on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: "INIT_STATE", payload: parsed });
      }
    } catch {
      // Ignore local storage error or invalid JSON
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      const { user, spaces, onboardingDone, onboardingSelectedTypes } = state;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user, spaces, onboardingDone, onboardingSelectedTypes })
      );
    } catch {
      // Ignore localStorage quotas / private browsing errors
    }
  }, [state]);

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

  const approvePayout = useCallback(
    (spaceId: string, payoutId: string, approverName: string) => {
      dispatch({
        type: "APPROVE_PAYOUT",
        payload: { spaceId, payoutId, approverName },
      });
    },
    []
  );

  const rejectPayout = useCallback((spaceId: string, payoutId: string) => {
    dispatch({
      type: "REJECT_PAYOUT",
      payload: { spaceId, payoutId },
    });
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

  const completeOnboarding = useCallback((selectedTypes?: string[]) => {
    dispatch({ type: "COMPLETE_ONBOARDING", payload: { selectedTypes } });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        signIn,
        signOut,
        addSpace,
        updateSpace,
        approvePayout,
        rejectPayout,
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
