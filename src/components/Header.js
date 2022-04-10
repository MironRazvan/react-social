import React from "react"
import { Button, Stack } from "react-bootstrap"
import { logout } from "../firebase/firebase"

function Header(props) {
	// logout function
	async function handleLogout() {
		try {
			await logout()
		} catch (e) {
			console.log(e)
			return
		}
	}

	return (
		<>
			<Stack direction="horizontal" className="dash--header w-100">
				<h3>ReactSocial</h3>
				<Button
					className="dash--button"
					variant="outline-danger"
					onClick={handleLogout}
				>
					Log Out
				</Button>
			</Stack>
		</>
	)
}

export default Header
