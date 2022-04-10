import React, { Component } from "react"
import {
	collection,
	getDocs,
	getDoc,
	orderBy,
	query,
	where,
	startAt,
	endAt,
} from "firebase/firestore"
import { Form, Button } from "react-bootstrap"
import { db } from "../firebase/firebase"

// const navigate = useNavigate()

export class SearchUser extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userInput: "",
			handlesList: [{ realName: "", username: "", userID: "" }],
		}
	}

	resetStateHandleList = () => {
		this.setState({
			...this.state,
			handlesList: [
				{
					username: "",
					realName: "",
					userID: "",
				},
			],
		})
	}

	fetchHandles = async (event) => {
		event.preventDefault()

		// checks for user input (must be at least one character)
		if (this.state.userInput == "") {
			this.resetStateHandleList()
			return
		}

		// queries db for usernames which contain the string that the user inputs
		const citiesRef = collection(db, "user_info")
		const q = query(
			citiesRef,
			orderBy("handle_lowercase", "asc"),
			startAt(this.state.userInput.toLowerCase()),
			endAt(this.state.userInput.toLowerCase() + "\uf8ff")
		)
		const querySnapshot = await getDocs(q)

		// resetting the state variable
		this.resetStateHandleList()

		// adding results to state variable
		querySnapshot.forEach((element) => {
			this.setState({
				...this.state,
				handlesList: [
					...this.state.handlesList,
					{
						realName: element.data().name,
						username: element.data().handle,
						userID: element.data().userID,
					},
				],
			})
		})
	}

	handleChange = (event) => {
		this.setState({ userInput: event.target.value })
	}

	render() {
		const handlesArray = this.state.handlesList
			.filter((value) => value.realName != "")
			.map((newUser) => (
				<div
					className="dash--user--searched"
					key={newUser.username}
					onClick={(event) =>
						this.props.handleClick(
							event,
							newUser.username,
							newUser.userID
						)
					}
				>
					{newUser.realName} (@{newUser.username})
				</div>
			))
		return (
			<>
				<h5>Search for friends...</h5>
				<Form onSubmit={this.fetchHandles}>
					<Form.Control
						type="text"
						name="userInputValue"
						placeholder="Type someones @..."
						value={this.state.userInput}
						onChange={(event) => this.handleChange(event)}
					></Form.Control>
					<Button variant="primary" type="submit">
						Search User
					</Button>
				</Form>
				<br></br>
				<br></br>
				<br></br>
				<div>{this.state.handlesList.length > 1 && handlesArray}</div>
			</>
		)
	}
}

export default SearchUser
