import React, { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate, useLocation } from "react-router-dom"
import { auth, db, logout } from "../firebase/firebase"
import { Card } from "react-bootstrap"
import { doc, getDoc } from "firebase/firestore"
import Header from "./Header"
import Post from "./Post"
import Footer from "./Footer"
import SearchUser from "./SearchUser"

export default function Dash(props) {
	const navigate = useNavigate()
	const location = useLocation()
	const [userUID, setUserUID] = useState(location.state.currentUser)
	const [userHandle, setUserHandle] = useState(location.state.userHandle)
	const [user] = useAuthState(auth)
	const [userData, setUserData] = useState({})

	useEffect(() => {
		if (!user) navigate("/login")

		// fetches user info from db
		const docRef = doc(db, `user_info/${userUID}`)
		const fetchUserInfo = async () => {
			const docSnap = await getDoc(docRef)
			const userInfo = docSnap.data()
			setUserData(userInfo)
		}
		fetchUserInfo().catch((e) => {
			console.log(e)
		})
	}, [])

	function handleUserSearchClick(event, username, userID) {
		event.preventDefault()
		// username and userID are sent as params because they come from different db and i'm lazy
		navigate("/userpage", { state: { username: username, userID: userID } })
	}

	return (
		<>
			{user ? (
				<>
					<Header />
					<Card className="dash--posts mb-4 w-100 align-items-center">
						<Card.Body>
							Welcome back, <strong>{userHandle}</strong>!
						</Card.Body>
					</Card>
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
