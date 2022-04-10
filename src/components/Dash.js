import React, { useEffect, useRef, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate, useLocation } from "react-router-dom"
import { auth, db, logout } from "../firebase/firebase"
import { Card, Form, Button } from "react-bootstrap"
import { doc, collection, getDoc, addDoc } from "firebase/firestore"
import Header from "./Header"
import Post from "./Post"
import Footer from "./Footer"
import SearchUser from "./SearchUser"

export default function Dash(props) {
	const navigate = useNavigate()
	const location = useLocation()
	const newMessage = useRef()
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

	async function handleNewMessage(event) {
		event.preventDefault()
		console.log(`new message: ${newMessage.current.value}`)
		await addDoc(collection(db, "user_posts"), {
			body: `${newMessage.current.value}`,
			time: new Date(),
			userID: `${user.uid}`,
		})
	}

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
		return () => {
			setUserData({})
		}
	}, [updater])

	return (
		<>
			{user ? (
				<>
					<Header />
					<Card className="dash--posts mb-4 w-100 align-items-center">
						<Card.Body>
							<Form
								className="d-flex"
								onSubmit={handleNewMessage}
							>
								<Form.Group className="d-flex">
									<Form.Label>New Message</Form.Label>
									<Form.Control
										type="text"
										placeholder="New Message"
										ref={newMessage}
									/>
								</Form.Group>
								<Button type="submit">Post New Message</Button>
							</Form>
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
