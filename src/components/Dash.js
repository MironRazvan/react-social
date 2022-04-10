import React, { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate, useLocation } from "react-router-dom"
import { auth, db } from "../firebase/firebase"
import { doc, collection, getDoc, addDoc } from "firebase/firestore"
import Header from "./Header"
import Post from "./Post"
import Footer from "./Footer"
import SearchUser from "./SearchUser"
import PostMessage from "./PostMessage"

export default function Dash(props) {
	const navigate = useNavigate()
	const location = useLocation()
	const [userUID, setUserUID] = useState(location.state.currentUser)
	const [userHandle, setUserHandle] = useState(location.state.userHandle)
	const [user] = useAuthState(auth)
	const [userData, setUserData] = useState({})
	const [updater, setUpdater] = useState(true)

	function handleUserSearchClick(event, username, userID) {
		event.preventDefault()
		// username and userID are sent as params because they come from different db and i'm lazy
		navigate("/userpage", { state: { username: username, userID: userID } })
	}

	async function handleNewMessage(event, message) {
		event.preventDefault()
		console.log(`primit in dash din postmessage: ${message}`)
		await addDoc(collection(db, "user_posts"), {
			body: `${message}`,
			time: new Date(),
			userID: `${user.uid}`,
		})
		setUpdater((prevState) => !prevState)
	}

	async function fetchUserData(userID) {
		const docRef = doc(db, `user_info/${userID}`)
		const docSnap = await getDoc(docRef)
		return docSnap.data()
	}

	useEffect(() => {
		if (!user) navigate("/login")

		// fetches user info from db
		fetchUserData(userUID)
			.then((result) => setUserData(result))
			.catch((e) => {
				console.log(e)
			})
		return () => {
			setUserData({})
		}
	}, [updater])

	return (
		<>
			{user ? (
				<>
					<Header />
					<PostMessage handleClick={handleNewMessage} />
					<hr />
					<div className="dash--styling">
						<Post user={user.uid} forSelf={false} />
						<div className="dash--search">
							<SearchUser handleClick={handleUserSearchClick} />
						</div>
					</div>
					<Footer />
				</>
			) : (
				navigate("/redirect")
			)}
		</>
	)
}
