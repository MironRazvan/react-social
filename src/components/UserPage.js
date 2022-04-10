import React, { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase/firebase"
import Header from "./Header"
import Footer from "./Footer"
import Post from "./Post"
import { useNavigate, useLocation } from "react-router-dom"
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	updateDoc,
	arrayUnion,
	arrayRemove,
} from "firebase/firestore"
import { Button } from "react-bootstrap"

function UserPage(props) {
	const [user] = useAuthState(auth)
	const navigate = useNavigate()
	const location = useLocation()
	const userHandle = useState(location.state.username)
	const userID = useState(location.state.userID)
	const [check, setCheck] = useState(true)
	const [updater, setUpdater] = useState(true)

	// checks if user can be followed, also if current user is user
	async function canBeFollowed() {
		const citiesRef = collection(db, "user_info")
		const q = query(
			citiesRef,
			where("userID", "==", `${user.uid}`),
			where("follows", "array-contains-any", [`${userID[0]}`])
		)

		const querySnapshot = await getDocs(q)
		if (querySnapshot.size === 0) return true
		return false
	}

	async function followUser(userID, followState) {
		const followersRef = doc(db, "user_info", `${user.uid}`)

		if (followState) {
			// adds a new follower
			await updateDoc(followersRef, {
				follows: arrayUnion(`${userID[0]}`),
			})
		} else {
			// removes follower
			await updateDoc(followersRef, {
				follows: arrayRemove(`${userID[0]}`),
			})
		}
		setUpdater((prevState) => !prevState)
	}

	useEffect(() => {
		if (!user || !props) navigate("/login")
		canBeFollowed().then((result) => setCheck(result))
	}, [updater])

	return (
		<>
			{user ? (
				<>
					<Header />
					<div>
						{userHandle} at user id: {userID}
					</div>
					{user.uid != userID[0] && (
						<Button
							variant={check ? "primary" : "danger"}
							onClick={() => followUser(userID, check)}
						>
							{check ? "Follow" : "Unfollow"}
						</Button>
					)}
					<div className="dash--styling">
						<Post user={userID} forSelf={true} />
					</div>
					<Footer />
				</>
			) : (
				navigate("/redirect")
			)}
		</>
	)
}

export default UserPage
