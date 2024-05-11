// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyBELNbQQnQgQmvzOLQ6WdKQqqfXg6ha88c",
    authDomain: "contactusdetails-add01.firebaseapp.com",
    projectId: "contactusdetails-add01",
    storageBucket: "contactusdetails-add01.appspot.com",
    messagingSenderId: "464781346393",
    appId: "1:464781346393:web:c40b00571b0a0999b19348",
    measurementId: "G-RBC89ZZM0H"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app