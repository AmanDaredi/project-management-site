import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAfTmQ6ZR9CPe8WuJdGpKtOXqSqpJgufzg",
  authDomain: "project-management-sitee.firebaseapp.com",
  projectId: "project-management-sitee",
  storageBucket: "project-management-sitee.appspot.com",
  messagingSenderId: "177985425248",
  appId: "1:177985425248:web:e95a62e5b28778be229805",
}

// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

// timestamp
const timestamp = firebase.firestore.Timestamp

export { projectAuth, projectFirestore, projectStorage, timestamp }
