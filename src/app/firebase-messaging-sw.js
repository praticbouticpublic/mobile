
importScripts(
  "https://www.gstatic.com/firebasejs/9.7.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.7.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCWaVBs0thhA37q6FwwlG-Vg_CkE4vk7L8",
  authDomain: "praticboutic.firebaseapp.com",
  projectId: "praticboutic",
  storageBucket: "praticboutic.appspot.com",
  messagingSenderId: "50443410557",
  appId: "1:50443410557:android:bcdbf6926ca5f87a41a514"
});
const messaging = firebase.messaging();
