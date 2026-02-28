
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, firebaseInitError, missingFirebaseConfigKeys } from './firebase';
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const createConfigError = () => ({
    type: 'firebase_config',
    message: firebaseInitError?.message || 'Firebase is not configured correctly.',
    missingKeys: missingFirebaseConfigKeys
  });

  const ensureAuthIsReady = () => {
    if (!auth || firebaseInitError) {
      const error = createConfigError();
      setAuthError(error);
      throw error;
    }
  };

  useEffect(() => {
    if (!auth || firebaseInitError) {
      setAuthError(createConfigError());
      setIsLoadingAuth(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthenticated(!!user);
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      ensureAuthIsReady();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
      if (!error.type) {
        setAuthError(error);
      }
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      ensureAuthIsReady();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email login failed", error);
      if (!error.type) {
        setAuthError(error);
      }
      throw error;
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      ensureAuthIsReady();
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Signup failed", error);
      if (!error.type) {
        setAuthError(error);
      }
      throw error;
    }
  };

  const logout = async (shouldRedirect = true) => {
    try {
      ensureAuthIsReady();
      await signOut(auth);
      if (shouldRedirect) {
        const isGitHubPages = window.location.pathname.includes('/FIT/');
        window.location.href = isGitHubPages ? '/FIT/' : '/';
      }
    } catch (error) {
      console.error("Logout failed", error);
      if (!error.type) {
        setAuthError(error);
      }
    }
  };

  const navigateToLogin = () => {
    // For now, we'll just trigger the login popup
    login();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      authError,
      login,
      loginWithEmail,
      signUpWithEmail,
      logout,
      navigateToLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
