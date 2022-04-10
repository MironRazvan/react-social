import React, { Component, useRef } from "react"
import { Card, Form, Button, Stack } from "react-bootstrap"

export class PostMessage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userMessage: "",
		}
	}

	componentDidMount() {}

	handleChange = (e) => {
		this.setState((prevState) => {
			prevState.userMessage = e.target.value
		})
		console.log(this.state.userMessage)
	}

	render() {
		return (
			<Form
				className="postMessage--container justify-content-center mb-2 mt-3"
				onSubmit={(e) =>
					this.props.handleClick(e, this.state.userMessage)
				}
			>
				<Stack
					direction="horizontal"
					gap={3}
					className="d-flex justify-content-center align-items-center"
				>
					<Form.Control
						type="text"
						placeholder="New Message"
						onChange={this.handleChange}
					/>
					<div className="vr" />
					<Button type="submit" variant="secondary">
						Post
					</Button>
				</Stack>
			</Form>
		)
	}
}

export default PostMessage
