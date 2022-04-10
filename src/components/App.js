import React from "react"
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom"
import Login from "./landing/Login"
import Register from "./landing//Register"
import FinalizeRegistration from "./landing/FinalizeRegistration"
import Dash from "./Dash"
import UserPage from "./UserPage"

class App extends React.Component {
	render() {
		return (
			<>
				<Router>
					<Routes>
						<Route exact path="/" element={<Dash />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route
							path="/finalizeregistration"
							element={<FinalizeRegistration />}
						/>
						<Route path="/userpage" element={<UserPage />} />
						<Route
							path="/redirect"
							element={<Navigate to="/login" />}
						/>
					</Routes>
				</Router>
			</>
		)
	}
}

export default App
