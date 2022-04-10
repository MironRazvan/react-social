import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	deleteUser,
	reauthenticateWithCredential,
	reauthenticateWithPopup,
} from "firebase/auth"

const firebaseConfig = {
	apiKey: "AIzaSyCWYIadgpZo-7gY1_VBjP_rCTBSC8dH9X0",
	authDomain: "fir-learning-a0d0d.firebaseapp.com",
	projectId: "fir-learning-a0d0d",
	storageBucket: "fir-learning-a0d0d.appspot.com",
	messagingSenderId: "698102441841",
	appId: "1:698102441841:web:27d74eb52cc99cd03978d0",
	measurementId: "G-NN0MVB5SLT",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const user = auth.currentUser
const db = getFirestore(app)

const logInWithEmailAndPassword = async (email, password) => {
	// try {
	// 	await signInWithEmailAndPassword(auth, email, password)
	// } catch (error) {
	// 	console.log(error)
	// 	alert("Eroare din firebase.js: ", error)
	// }
	return await signInWithEmailAndPassword(auth, email, password)
}

const registerWithEmailAndPassword = async (email, password) => {
	try {
		await createUserWithEmailAndPassword(auth, email, password)
	} catch (error) {
		console.log(error)
		alert(error)
	}
}

const deleteUserOwn = async () => {
	try {
		deleteUser(user)
	} catch (error) {
		console.log(error)
		alert(error)
	}
}

const logout = async () => {
	signOut(auth)
}

export {
	auth,
	db,
	logInWithEmailAndPassword,
	registerWithEmailAndPassword,
	logout,
	deleteUserOwn,
}
