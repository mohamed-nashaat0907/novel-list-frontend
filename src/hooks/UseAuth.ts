// useAuth.ts
import { useContext } from "react";
import { createContext } from "react";
import type { IauthContext } from "../data/interfaces";
export const AuthContext = createContext<IauthContext | null>(null);


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
