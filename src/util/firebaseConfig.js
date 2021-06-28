import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyBym0jPTbpGkXuJFo7FipJNPlX7da30FgE',
  authDomain: 'warningapp-368d4.firebaseapp.com',
  projectId: 'warningapp-368d4',
  storageBucket: 'warningapp-368d4.appspot.com',
  messagingSenderId: '779718380333',
  appId: '1:779718380333:web:ae0f4c9dd363ada5f3a1a4',
  measurementId: 'G-79VLTY5B0Y',
};

// Initialize Firebase
export const RNfirebase = firebase.initializeApp(firebaseConfig);
