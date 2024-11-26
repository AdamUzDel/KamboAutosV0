import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA5Azonf8yRNRJVfDSAabDqlPwEeApmbcg",
  authDomain: "kamboautos.firebaseapp.com",
  projectId: "kamboautos",
  storageBucket: "kamboautos.appspot.com",
  messagingSenderId: "899743671136",
  appId: "1:899743671136:web:d8fce6b4d4448efc50f405",
  measurementId: "G-JJDW469VDB"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const storage = getStorage(app);

let analytics: any;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, storage, analytics };