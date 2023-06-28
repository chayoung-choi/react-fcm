import {initializeApp} from "firebase/app";
import {getMessaging, getToken, onMessage, isSupported} from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
});
const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }
    console.log('Firebase not supported this browser');
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
})();

export const db = getFirestore(firebaseApp);
export const getFcmToken = (setFcmToken) => {
  return getToken(messaging, {vapidKey: process.env.REACT_APP_VAPID_KEY}).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setFcmToken(currentToken);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setFcmToken(null);
      // shows on the UI that permission is required
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    setFcmToken(null);
    // catch error while creating client token
  });
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("[firebase.js onMessageListener]", payload)
      resolve(payload);
    });
  });
