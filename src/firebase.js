import {initializeApp} from "firebase/app";
import {getMessaging, getToken, onMessage} from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseApp = initializeApp({
  apiKey: "AIzaSyDXAGmntkmE5fS5-azKSi6KgAiHNz9Yq_s",
  authDomain: "react-fcm-512a3.firebaseapp.com",
  projectId: "react-fcm-512a3",
  storageBucket: "react-fcm-512a3.appspot.com",
  messagingSenderId: "246151470857",
  appId: "1:246151470857:web:60e3555a6ff3cc8b2f3dd8",
  measurementId: "G-WS3VJM11G5"
});
export const messaging = getMessaging(firebaseApp);
export const requestPermission = async()=> {
  console.log("권한 요청 중...");

  const permission = await Notification.requestPermission();
  if (permission === "denied") {
    console.log("알림 권한 허용 안됨");
    return;
  }

  console.log("알림 권한이 허용됨");

  const token = await getToken(messaging, {
    vapidKey: "BHadSAVXB4BCNb1UG5wlL3I04eG6redZTHgMqUOq9q19r_vJGm6uGVc7BokTJ1sQn_ToIQvdzlSNx2IstRuuwoI",
  });

  if (token) console.log("token: ", token);
  else console.log("Can not get Token");

  onMessage(messaging, (payload) => {
    console.log("메시지가 도착했습니다.", payload);
    // ...
  });
}
