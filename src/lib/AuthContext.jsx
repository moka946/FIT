
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
import { Capacitor } from '@capacitor/core';
import { signInWithRedirect, getRedirectResult, signInWithCredential } from 'firebase/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

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

    // Handle the redirect result if returning from Google sign in
    const handleRedirect = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const result = await getRedirectResult(auth);
          if (result && result.user) {
            setUser(result.user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Error with redirect login:", error);
          setAuthError(error);
        }
      }
    };
    
    handleRedirect();

    // Initialize GoogleAuth for Capacitor
    if (Capacitor.isNativePlatform()) {
      try {
        GoogleAuth.initialize();
      } catch (e) {
        console.warn("GoogleAuth.initialize error (often safe to ignore):", e);
      }
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
      if (Capacitor.isNativePlatform()) {
        console.log("Starting Native Google Sign In...");
        const googleUser = await GoogleAuth.signIn().catch(err => {
          console.error("Internal GoogleAuth.signIn native error:", err);
          throw err;
        });

        console.log("Native Google Sign In raw result:", googleUser);
        
        if (googleUser && googleUser.authentication && googleUser.authentication.idToken) {
           const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
           await signInWithCredential(auth, credential);
        } else if (googleUser && googleUser.idToken) {
           // Fallback for some versions of the plugin
           const credential = GoogleAuthProvider.credential(googleUser.idToken);
           await signInWithCredential(auth, credential);
        } else {
           console.error("Google login failed - no ID token found in response.", googleUser);
           throw new Error("Google login failed to return a valid security token.");
        }
      } else {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      console.error("Login failed detailed error:", error);
      let errorMessage = error.message || "Unknown Error";
      
      // If native error has a code (like 10: DEVELOPER_ERROR), show it
      if (error.code) {
        errorMessage = `(Code ${error.code}) ${errorMessage}`;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setAuthError({ message: errorMessage });
      throw new Error(errorMessage);
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
