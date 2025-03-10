// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration with environment variables and fallbacks
const firebaseConfig = {
  apiKey: "AIzaSyBTBDtgKhHd66YYMeJZ8zpxTzH-UkkoqPY",
  authDomain: "hat-app-1f397.firebaseapp.com",
  projectId: "hat-app-1f397",
  storageBucket: "hat-app-1f397.firebasestorage.app",
  messagingSenderId: "606917731426",
  appId: "1:606917731426:web:f91253fd0ca193e1379d3b",
  measurementId: "G-87X7LGH9GD"
};


// Check if Firebase configuration is valid
const isFirebaseConfigured = firebaseConfig.apiKey !== "AIzaSyBTBDtgKhHd66YYMeJZ8zpxTzH-UkkoqPY" && 
                            firebaseConfig.projectId !== "hat-app-1f397";

// Initialize Firebase if configured
let app, auth, db, storage;

try {
  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    console.warn("Firebase configuration is missing. Firebase services will be unavailable.");
    // Create mock objects to prevent null reference errors
    auth = {
      currentUser: null,
      onAuthStateChanged: (callback) => callback(null),
      signInWithEmailAndPassword: () => Promise.reject(new Error("Firebase service coming soon")),
      createUserWithEmailAndPassword: () => Promise.reject(new Error("Firebase service coming soon")),
      signOut: () => Promise.resolve()
    };
    db = {
      collection: () => ({
        doc: () => ({
          get: () => Promise.resolve({ exists: false, data: () => ({}) }),
          set: () => Promise.reject(new Error("Firebase service coming soon"))
        }),
        add: () => Promise.reject(new Error("Firebase service coming soon")),
        where: () => ({
          get: () => Promise.resolve({ empty: true, docs: [] })
        })
      })
    };
    storage = {
      ref: () => ({
        put: () => Promise.reject(new Error("Firebase service coming soon")),
        getDownloadURL: () => Promise.reject(new Error("Firebase service coming soon"))
      })
    };
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Same mock objects as above in case of initialization error
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => callback(null),
    signInWithEmailAndPassword: () => Promise.reject(new Error("Firebase service coming soon")),
    createUserWithEmailAndPassword: () => Promise.reject(new Error("Firebase service coming soon")),
    signOut: () => Promise.resolve()
  };
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => ({}) }),
        set: () => Promise.reject(new Error("Firebase service coming soon"))
      }),
      add: () => Promise.reject(new Error("Firebase service coming soon")),
      where: () => ({
        get: () => Promise.resolve({ empty: true, docs: [] })
      })
    })
  };
  storage = {
    ref: () => ({
      put: () => Promise.reject(new Error("Firebase service coming soon")),
      getDownloadURL: () => Promise.reject(new Error("Firebase service coming soon"))
    })
  };
}

export { auth, db, storage, isFirebaseConfigured };
