import { createContext, useContext, useState } from "react";

type Role = "guest" | "user" | "admin";

interface AuthContextValue {
  role: Role;
  username: string;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadFromSession(): { role: Role; username: string } {
  const role = (sessionStorage.getItem("loveapp_role") as Role) || "guest";
  const username = sessionStorage.getItem("loveapp_username") || "";
  return { role, username };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = loadFromSession();
  const [role, setRole] = useState<Role>(initial.role);
  const [username, setUsername] = useState<string>(initial.username);

  const login = (u: string, p: string): boolean => {
    if (u === "love" && p === "447") {
      setRole("user");
      setUsername("love");
      sessionStorage.setItem("loveapp_role", "user");
      sessionStorage.setItem("loveapp_username", "love");
      return true;
    }
    if (u === "Admin07" && p === "447") {
      setRole("admin");
      setUsername("Admin07");
      sessionStorage.setItem("loveapp_role", "admin");
      sessionStorage.setItem("loveapp_username", "Admin07");
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole("guest");
    setUsername("");
    sessionStorage.removeItem("loveapp_role");
    sessionStorage.removeItem("loveapp_username");
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        username,
        isAdmin: role === "admin",
        isLoggedIn: role !== "guest",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
