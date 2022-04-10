import React, { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase/firebase"
import Header from "./Header"
import Footer from "./Footer"
import Post from "./Post"
import { useNavigate, useLocation } from "react-router-dom"
import { collection, query, where, getDocs } from "firebase/firestore"
import { Button } from "react-bootstrap"

function UserPage(props) {
	const [user] = useAuthState(auth)
	const navigate = useNavigate()
	const location = useLocation()
	const userHandle = useState(location.state.username)
	const userID = useState(location.state.userID)
	const [check, setCheck] = useState(true)

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

	// TODO add user to followed list

	useEffect(() => {
		if (!user || !props) navigate("/login")
		canBeFollowed().then((result) => setCheck(result))
		// console.log(canBeFollowed)
	}, [])

	return (
		<>
			{user ? (
				<>
					<Header />
					<div>
						{userHandle} at user id: {userID}
					</div>
					{user.uid != userID[0] && (
						<Button variant={check ? "primary" : "danger"}>
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
