"use client";

import { createContext, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

 
  const login = async (email, password) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return {
      success: !result.error,
      message: result.error,
    };
  };

 
  const logout = () => {
    signOut({ callbackUrl: "/login" });
  };

 
  const register = async (email, password, name) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || "Registration failed" };
      }

     
      await login(email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: "An error occurred during registration" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user,  
        login,
        logout,
        register,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
