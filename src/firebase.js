import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc 
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBjeccSu886Cb2jmjMTOj0sw4AgobbiOo0",
  authDomain: "mollomultimarcas.firebaseapp.com",
  projectId: "mollomultimarcas",
  storageBucket: "mollomultimarcas.firebasestorage.app",
  messagingSenderId: "1081441322055",
  appId: "1:1081441322055:web:b9fb1dc1716bf3d7711d62",
  measurementId: "G-Y5HSELRJSB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exportar
export { 
  auth, 
  db,
  storage,
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};