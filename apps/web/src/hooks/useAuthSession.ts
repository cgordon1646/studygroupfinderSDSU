import { useCallback, useEffect, useState } from "react";
import {
  AUTH_TOKEN_KEY,
  clearStoredAuth,
  reconcileExpiredAuth,
  syncProfileIfAuthenticated,
  tokenIsAuthenticated,
} from "../auth/session";

export interface AuthSessionProfile {
  isSignedIn: boolean;
  userName: string;
  userEmail: string;
  userMajor: string;
  userYear: string;
  userRedId: string;
}

function readProfileFromStorage(): Omit<AuthSessionProfile, "isSignedIn"> {
  return {
    userName: localStorage.getItem("userName") || "",
    userEmail: localStorage.getItem("userEmail") || "",
    userMajor: localStorage.getItem("userMajor") || "",
    userYear: localStorage.getItem("userYear") || "",
    userRedId: localStorage.getItem("userRedId") || "",
  };
}

export function useAuthSession(options: { listenStorage?: boolean } = {}) {
  const { listenStorage = false } = options;
  const [state, setState] = useState<AuthSessionProfile>(() => {
    reconcileExpiredAuth();
    const signedIn = tokenIsAuthenticated();
    return {
      isSignedIn: signedIn,
      ...(signedIn ? readProfileFromStorage() : emptyProfile()),
    };
  });

  const refresh = useCallback(() => {
    reconcileExpiredAuth();
    const signedIn = tokenIsAuthenticated();
    setState({
      isSignedIn: signedIn,
      ...(signedIn ? readProfileFromStorage() : emptyProfile()),
    });
  }, []);

  useEffect(() => {
    refresh();
    void syncProfileIfAuthenticated().then(refresh);
  }, [refresh]);

  useEffect(() => {
    if (!listenStorage) return;
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === AUTH_TOKEN_KEY ||
        e.key === "isAuthenticated" ||
        e.key === "userEmail" ||
        e.key === "userName" ||
        e.key === null
      ) {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [listenStorage, refresh]);

  const logout = useCallback(() => {
    clearStoredAuth();
    refresh();
  }, [refresh]);

  return { ...state, refresh, logout };
}

function emptyProfile(): Omit<AuthSessionProfile, "isSignedIn"> {
  return {
    userName: "",
    userEmail: "",
    userMajor: "",
    userYear: "",
    userRedId: "",
  };
}
