import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { browserPopupRedirectResolver, getAuth, GoogleAuthProvider, setPersistence, signInWithPopup } from "firebase/auth";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// const appCheck = initializeAppCheck(app, {
//     provider: new ReCaptchaV3Provider(process.env.RECAPTCHA),
//     isTokenAutoRefreshEnabled: true,
// });