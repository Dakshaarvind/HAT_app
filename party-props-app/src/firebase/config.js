// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration with environment variables and fallbacks
const firebaseConfig = {
  apiKey: "FAKE_API_KEY",
  authDomain: "fake-project.firebaseapp.com",
  projectId: "fake-project",
  storageBucket: "fake-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefghij",
  measurementId: "G-FAKE1234"
};


// Check if Firebase configuration is valid
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY" && 
                            firebaseConfig.projectId !== "YOUR_PROJECT_ID";

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
