import { initializeApp } from 'firebase'

// TEST

const app = initializeApp({
  apiKey: 'AIzaSyCoEI1RieubL2z_TIwD4R5FHokpgGMvngs',
  authDomain: 'app-film-bd1b7.firebaseapp.com',
  databaseURL: 'https://app-film-bd1b7.firebaseio.com',
  projectId: 'app-film-bd1b7',
  storageBucket: 'app-film-bd1b7.appspot.com',
  messagingSenderId: '796383962142'
})

// MOODIES

// const app = initializeApp({
//   apiKey: 'AIzaSyDNZiZQTmoc3yd0qaOrGqjvvK9zpv9FebA',
//   authDomain: 'moodies-fr.firebaseapp.com',
//   databaseURL: 'https://moodies-fr.firebaseio.com',
//   projectId: 'moodies-fr',
//   storageBucket: 'moodies-fr.appspot.com',
//   messagingSenderId: '297594988637'
// })

export const db = app.database()
