// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZWiLhPOhX4GfRjJKa-7lAAuy2iTg2UII",
  authDomain: "semantic-notes-ef4b7.firebaseapp.com",
  projectId: "semantic-notes-ef4b7",
  storageBucket: "semantic-notes-ef4b7.firebasestorage.app",
  messagingSenderId: "544118291084",
  appId: "1:544118291084:web:ad0c9e7af3114f3108d9a9",
  measurementId: "G-R68C86Q9ZT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
