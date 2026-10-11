"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const DEMO_ACCOUNTS = [
  {
    id: "user-1",
    name: "Aarohi Sharma",
    email: "aarohi.sharma@bhopalmunicipal.gov.in",
    role: "Town Planning Officer",
    organization: "Bhopal Municipal Corporation (BMC)",
    badge: "Official Municipal Clerk",
    avatar: "AS",
  },
  {
    id: "user-2",
    name: "Er. Rajesh Saxena",
    email: "rajesh@saxena-architects.in",
    role: "Registered Architect / Structural Engineer",
    organization: "Council of Architecture (CA/2014/58291)",
    badge: "Licensed Architect",
    avatar: "RS",
  },
  {
    id: "user-3",
    name: "Devendra Patel",
    email: "devendra.patel@gmail.com",
    role: "Property Owner / Developer",
    organization: "Indore Urban Development Zone",
    badge: "Citizen / Applicant",
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
        // Default initial session for ease of hackathon demo
        setCurrentUser(DEMO_ACCOUNTS[0]);
        localStorage.setItem("bhuvikas_user", JSON.stringify(DEMO_ACCOUNTS[0]));
      }
    } catch {
      setCurrentUser(DEMO_ACCOUNTS[0]);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email, password, role = "Town Planning Officer") => {
    const existing = DEMO_ACCOUNTS.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
    const userToSet = existing || {
      id: "user-" + Date.now(),
      name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Officer User",
      email: email,
      role: role,
      organization: "Directorate of Town & Country Planning (T&CP)",
      badge: role.includes("Officer") ? "Official Municipal Clerk" : "Authorized Professional",
      avatar: (email[0] || "U").toUpperCase(),
    };

    setCurrentUser(userToSet);
    localStorage.setItem("bhuvikas_user", JSON.stringify(userToSet));
    return { success: true, user: userToSet };
  };

  const signup = ({ name, email, password, role, organization }) => {
    const newUser = {
      id: "user-" + Date.now(),
      name: name || "Verified User",
      email: email,
      role: role || "Town Planning Assistant",
      organization: organization || "Urban Local Body (MP)",
      badge: "Verified Account",
      avatar: (name ? name[0] : email[0]).toUpperCase(),
    };
    setCurrentUser(newUser);
    localStorage.setItem("bhuvikas_user", JSON.stringify(newUser));
    return { success: true, user: newUser };
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
