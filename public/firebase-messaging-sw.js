importScripts(
    'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts(
    'https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

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
const messaging = firebase.messaging()
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ',
      payload);
  // const notificationTitle = '[Background Message] '
  //     + payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: '/favicon.ico'
  // };

  // self.registration.showNotification(notificationTitle, notificationOptions);
})
