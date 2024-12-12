// Your web app's Firebase configuration
// export const firebaseConfig = {
//    [...]
// };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    // Things that should not be shared.
    apiKey: "AIzaSyBtYCVQNzKqZ48txIR2Aiw6AAisFDCL7E0",
    authDomain: "hcde438-final-food.firebaseapp.com",
    projectId: "hcde438-final-food",
    storageBucket: "hcde438-final-food.firebasestorage.app",
    messagingSenderId: "700404386159",
    appId: "1:700404386159:web:ff6cd95c304ae63782009a"
};

const app = initializeApp(firebaseConfig);