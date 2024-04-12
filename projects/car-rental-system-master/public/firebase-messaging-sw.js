importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyBfX0N0SYG_iSXC3WQThuLh7Grd44s05g4",
    authDomain: "car-rental-system-5c47c.firebaseapp.com",
    projectId: "car-rental-system-5c47c",
    storageBucket: "car-rental-system-5c47c.appspot.com",
    messagingSenderId: "1010553096422",
    appId: "1:1010553096422:web:b4c3a1ceb93e18c2dfd327",
    measurementId: "G-LXQDX9BVYZ"
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});