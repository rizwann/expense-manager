// Create a file named useAuth.tsx

import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
