import React, { useRef, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button, Form, Alert, Card, Container } from "react-bootstrap"
import { db, auth, logInWithEmailAndPassword } from "../../firebase/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import Footer from "../Footer"
import { collection, query, where, getDocs } from "firebase/firestore"

export default function Login() {
	const email = useRef()
	const password = useRef()
	const [err, setErr] = useState("")
	const [userHandle, setUserHandle] = useState("")
	const [user, loading] = useAuthState(auth)
	const navigate = useNavigate()

	// sets userHandle state based on userID (userID is the id of the current user)
	async function getCurrentUserHandle(userID) {
		const q = query(
			collection(db, "user_info"),
			where("userID", "==", `${userID}`)
		)
		const qSnap = await getDocs(q)
		if (qSnap.size == 1) {
			qSnap.forEach((doc) => {
				setUserHandle(doc.data().handle)
			})
		}
	}

	useEffect(() => {
		if (loading) return
		if (user) getCurrentUserHandle(user.uid)

		if (user && userHandle) {
			navigate("/", {
				state: {
					currentUser: `${user.uid}`,
					userHandle: `${userHandle}`,
				},
			})
		}
		return () => {
			setUserHandle("")
		}
	}, [user, loading, userHandle])

	async function handleSubmit(event) {
		event.preventDefault()

		if (!password.current.value) {
			setErr("Please type in your password")
			return
		}

		try {
			setErr("")
			await logInWithEmailAndPassword(
				email.current.value,
				password.current.value
			)
		} catch (e) {
			setErr("Unable to Log In")
			console.log(e)
		}
	}

	return (
		<>
			<Container
				className="d-flex flex-column align-items-center justify-content-center"
				style={{ minHeight: "100vh" }}
			>
				<Card className="login--container">
					<Card.Body>
						<h2 className="text-center mb-4">Login</h2>
						{err && <Alert variant="danger">{err}</Alert>}
						<Form onSubmit={handleSubmit}>
							<Form.Group id="email">
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" ref={email} />
							</Form.Group>
							<Form.Group id="password">
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" ref={password} />
							</Form.Group>
							<Button
								className="w-100 mt-4"
								type="submit"
								variant="primary"
							>
								Log In
							</Button>
						</Form>
					</Card.Body>
				</Card>
				<div className="w-100 text-center mt-2">
					Don't have an account?{" "}
					<Link to="/register">Create An Account</Link>
				</div>
			</Container>
			<Footer />
		</>
	)
}
