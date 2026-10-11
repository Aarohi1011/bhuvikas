"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const DEMO_ACCOUNTS = [
  {
    id: "user-aarohi-1011",
    name: "Aarohi Saxena",
    email: "aarohisaxena1011@gmail.com",
    role: "Town Planning Officer & Architect",
    organization: "Directorate of Town & Country Planning (T&CP)",
    badge: "Licensed Professional",
    avatar: "AS",
  },
  {
    id: "user-2",
    name: "Bhopal Civic Desk",
    email: "officer@bhopalmunicipal.gov.in",
    role: "Town Planning Officer",
    organization: "Bhopal Municipal Corporation (BMC)",
    badge: "Official Municipal Clerk",
    avatar: "BC",
  },
  {
    id: "user-3",
    name: "Devendra Patel",
    email: "devendra.patel@gmail.com",
    role: "Real Estate Broker / Channel Partner",
    organization: "Madhya Pradesh Property Advisory",
    badge: "RERA Registered Broker",
    avatar: "DP",
  },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bhuvikas_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        // Users start unauthenticated until they log in
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, role = "Town Planning Officer") => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem("bhuvikas_user", JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || "Login failed." };
      }
    } catch (err) {
      // Local fallback in case offline
      const normalized = (email || "").toLowerCase();
      if (normalized === "aarohisaxena1011@gmail.com" && (password === "demo" || !password)) {
        const user = DEMO_ACCOUNTS[0];
        setCurrentUser(user);
        localStorage.setItem("bhuvikas_user", JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, error: err.message || "Network error." };
    }
  };

  const signup = async ({ name, email, password, role, organization }) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", name, email, password, role, organization }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem("bhuvikas_user", JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || "Signup failed." };
      }
    } catch (err) {
      return { success: false, error: err.message || "Network error." };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("bhuvikas_user");
  };

  const switchDemoAccount = (index) => {
    const account = DEMO_ACCOUNTS[index] || DEMO_ACCOUNTS[0];
    setCurrentUser(account);
    localStorage.setItem("bhuvikas_user", JSON.stringify(account));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthenticated: !!currentUser,
        demoAccounts: DEMO_ACCOUNTS,
        login,
        signup,
        logout,
        switchDemoAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      currentUser: null,
      loading: false,
      isAuthenticated: false,
      demoAccounts: DEMO_ACCOUNTS,
      login: () => ({ success: true }),
      signup: () => ({ success: true }),
      logout: () => {},
      switchDemoAccount: () => {},
    };
  }
  return context;
}
