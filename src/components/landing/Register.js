import React, { useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button, Form, Alert, Card, Container } from "react-bootstrap"
import { registerWithEmailAndPassword } from "../../firebase/firebase"
import Footer from "../Footer"

export default function Register() {
	const email = useRef()
	const password = useRef()
	const passwordRef = useRef()
	const [err, setErr] = useState("")
	const navigate = useNavigate()

	async function handleSubmit(event) {
		event.preventDefault()

		if (password.current.value !== passwordRef.current.value) {
			setErr("Passwords do no match")
			return
		}

		try {
			setErr("")
			await registerWithEmailAndPassword(
				email.current.value,
				password.current.value
			)
			//navigate("/finalizeregistation")
			navigate("/finalizeregistration")
			//return <Navigate to="/finalizeregistation" mesaj="jojo" />
		} catch (e) {
			setErr("Unable to Register New Account")
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
						<h2 className="text-center mb-4">Register</h2>
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
							<Form.Group id="passwordCheck">
								<Form.Label>Password Check</Form.Label>
								<Form.Control
									type="password"
									ref={passwordRef}
								/>
							</Form.Group>
							<Button
								className="w-100 mt-4"
								type="submit"
								variant="primary"
							>
								Create Account
							</Button>
						</Form>
					</Card.Body>
				</Card>
				<div className="w-100 text-center mt-2">
					Already have an account? <Link to="/login">Log In</Link>
				</div>
			</Container>
			<Footer />
		</>
	)
}
