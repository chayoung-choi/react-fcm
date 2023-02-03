import {initializeApp} from "firebase/app";
import {getMessaging, getToken, onMessage} from "firebase/messaging";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDXAGmntkmE5fS5-azKSi6KgAiHNz9Yq_s",
  authDomain: "react-fcm-512a3.firebaseapp.com",
  projectId: "react-fcm-512a3",
  storageBucket: "react-fcm-512a3.appspot.com",
  messagingSenderId: "246151470857",
  appId: "1:246151470857:web:60e3555a6ff3cc8b2f3dd8",
  measurementId: "G-WS3VJM11G5"
});

const VAPID_KEY = "y"
export const messaging = getMessaging(firebaseApp);
export const getFcmToken = (setFcmToken) => {
  return getToken(messaging, {vapidKey: VAPID_KEY}).then((currentToken) => {
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
      resolve(payload);
    });
  });
