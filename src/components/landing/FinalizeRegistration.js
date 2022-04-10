import React, { useRef, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
	Button,
	Form,
	Alert,
	Card,
	Container,
	InputGroup,
	ButtonGroup,
} from "react-bootstrap"
import {
	doc,
	collection,
	query,
	where,
	getDocs,
	setDoc,
} from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { deleteUser } from "firebase/auth"
import { auth } from "../../firebase/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import Footer from "../Footer"

export default function FinalizeRegistration() {
	const name = useRef()
	const handle = useRef()
	const age = useRef()
	const location = useRef()
	const [user] = useAuthState(auth)
	const [err, setErr] = useState("")
	const [userInfo, setUserInfo] = useState({
		name: "",
		handle: "",
		follows: [],
		age: 0,
		location: "",
		userID: "",
	})
	const navigate = useNavigate()

	// convertsStringToCamelCase ;)
	function camelCase(str) {
		return str.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
			return g1.toUpperCase() + g2.toLowerCase()
		})
	}

	// gets userID from auth on initial render
	useEffect(() => {
		setUserInfo((prevInfo) => {
			return {
				...prevInfo,
				uid: user.uid,
			}
		})
	}, [])

	// checks if handle is available
	async function checkHandle(chosenHandle) {
		const q = query(
			collection(db, "user_info"),
			where("handle", "==", chosenHandle)
		)
		const qSnap = await getDocs(q)
		return qSnap.size
	}

	// adds user info to db
	async function addData(userData) {
		await setDoc(doc(db, "user_info", userData.uid), {
			name: camelCase(userData.name),
			handle: userData.handle,
			handle_lowercase: userData.handle.toLowerCase(),
			follows: [userData.uid],
			age: parseInt(userData.age),
			location: camelCase(userData.location),
			userID: userData.uid,
		})
	}

	// data confirmation and addData function call
	async function handleSubmit(event) {
		event.preventDefault()
		setErr("")

		// sanity checks
		if (handle.current.value.length < 4) {
			setErr("Handle too short")
			return
		}
		if (age.current.value < 14) {
			setErr("You're too young")
			return
		}
		if ((await checkHandle(handle.current.value)) > 0) {
			setErr("Handle already taken :(")
			return
		}

		// add user info to user_info db
		if (user && userInfo.handle) {
			addData(userInfo)
				// .then(console.log(user))
				.then(
					navigate("/", {
						state: {
							currentUser: `${user.uid}`,
							userHandle: `${userInfo.handle}`,
						},
					})
				)
				.catch((e) => {
					console.log(e)
				})
		}
	}

	// update state on user input
	function handleChange(event) {
		const { name, value } = event.target
		// console.log(value)
		setUserInfo((prevInfo) => {
			return {
				...prevInfo,
				[name]: value,
			}
		})
		// console.log(userInfo)
	}

	// handles canceling
	async function handleCancel() {
		if (!user) return

		try {
			await deleteUser(user)
			navigate("/login")
		} catch (error) {
			console.log(error)
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
						<h2 className="text-center mb-4">Fill In Your Info</h2>
						{err && <Alert variant="danger">{err}</Alert>}
						<Form onSubmit={handleSubmit}>
							<Form.Group id="name">
								<Form.Label>Name</Form.Label>
								<Form.Control
									placeholder="Your Full Name"
									type="text"
									ref={name}
									name="name"
									onChange={handleChange}
									required
								/>
							</Form.Group>
							<Form.Group id="handle">
								<Form.Label>Handle</Form.Label>
								<InputGroup>
									<InputGroup.Text id="basic-addon">
										@
									</InputGroup.Text>
									<Form.Control
										placeholder="username"
										type="text"
										aria-describedby="basic-addon"
										name="handle"
										onChange={handleChange}
										ref={handle}
										required
									/>
								</InputGroup>
							</Form.Group>
							<Form.Group id="age">
								<Form.Label>Age</Form.Label>
								<Form.Control
									type="number"
									ref={age}
									name="age"
									onChange={handleChange}
									required
								/>
							</Form.Group>
							<Form.Group id="location">
								<Form.Label>Location</Form.Label>
								<Form.Control
									type="text"
									ref={location}
									name="location"
									onChange={handleChange}
								/>
							</Form.Group>
							<ButtonGroup className="w-100">
								<Button
									className="w-60 mt-4 mr-4"
									type="submit"
									variant="primary"
								>
									Finish Creating Account
								</Button>
								<Button
									className="w-40 mt-4"
									type="button"
									variant="danger"
									onClick={handleCancel}
								>
									Cancel
								</Button>
							</ButtonGroup>
						</Form>
					</Card.Body>
				</Card>
			</Container>
			<Footer />
		</>
	)
}
