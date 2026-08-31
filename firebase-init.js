// Importações via CDN para o Firebase v10
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Sua configuração oficial do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDlWzipKxRpeiSRIXPJA6TI3Xt1GBNecpk",
  authDomain: "sistema-arkiv.firebaseapp.com",
  projectId: "sistema-arkiv",
  storageBucket: "sistema-arkiv.firebasestorage.app",
  messagingSenderId: "799435641171",
  appId: "1:799435641171:web:761ed3405467f02e1b91a6"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exporta o banco de dados para ser usado nos outros arquivos de script
window.db = db;
window.dbHelpers = { collection, getDocs, addDoc, doc, updateDoc, deleteDoc };

console.log("Firebase conectado com sucesso ao projeto sistema-arkiv!");