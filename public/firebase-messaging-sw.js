// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.9.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDXAGmntkmE5fS5-azKSi6KgAiHNz9Yq_s",
  authDomain: "react-fcm-512a3.firebaseapp.com",
  projectId: "react-fcm-512a3",
  storageBucket: "react-fcm-512a3.appspot.com",
  messagingSenderId: "246151470857",
  appId: "1:246151470857:web:60e3555a6ff3cc8b2f3dd8",
  measurementId: "G-WS3VJM11G5"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
