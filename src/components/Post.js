import React, { Component } from "react"
import {
	doc,
	getDoc,
	query,
	where,
	getDocs,
	collection,
} from "firebase/firestore"
import { db } from "../firebase/firebase"
import { Alert, Card, Stack } from "react-bootstrap"
import PostCard from "./PostCard"

export class Post extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			user: props.user,
			friends: [],
			posts: [],
		}
	}

	getDate = (dateInSeconds) => {
		var nextDay = new Date(dateInSeconds * 1000)
		//console.log(nextDay)
		var option = { weekday: "long" }
		var dayOfWeek = new Intl.DateTimeFormat("en-US", option).format(nextDay)
		return dayOfWeek
	}

	fetchFeed = async () => {
		// gets current user info which contains followed accounts
		const docUserInfo = doc(db, `user_info/${this.state.user}`)
		const docInfo = await getDoc(docUserInfo)
		const info = docInfo.data()

		// set friend list in state
		this.setState({ ...this.state, friends: info.follows })

		// for each friend in list get his/hers/their messages from db
		this.state.friends.forEach((friendID) => {
			const friendMessages = this.fetchMessages(friendID)
			friendMessages.then((messagesList) => {
				messagesList.forEach((message) => {
					// sets messsages in state
					this.setState({
						...this.state,
						posts: [
							...this.state.posts,
							{
								user: message.id,
								time: message.time,
								post: message.body,
							},
						],
					})
				})
			})
		})
		// set loading to false to signal fetch completion
		this.setState({ ...this.state, loading: false })
	}

	fetchSelf = async () => {
		const myMessages = this.fetchMessages(this.state.user[0])
		myMessages.then((messagesList) => {
			messagesList.forEach((message) => {
				// sets messsages in state
				this.setState({
					...this.state,
					posts: [
						...this.state.posts,
						{
							user: message.id,
							time: message.time,
							post: message.body,
						},
					],
				})
			})
		})
		this.setState({ ...this.state, loading: false })
	}

	fetchMessages = async (paramID) => {
		const myQuery = query(
			collection(db, "user_posts"),
			where("userID", "==", paramID)
		)
		const querySnapshot = await getDocs(myQuery)
		const messagesArray = []
		try {
			querySnapshot.forEach((doc) => {
				// console.log("datele mesajului sunt", doc.data())
				messagesArray.push({
					id: doc.data().userID,
					body: doc.data().body,
					time: doc.data().time.seconds,
				})
			})
		} catch (error) {}
		return messagesArray
	}

	componentDidMount() {
		// handles db calls for user feed based on follows or user feed for individual users
		if (this.props.forSelf) this.fetchSelf()
		else this.fetchFeed()
	}

	render() {
		let userPostsList = this.state.posts
		// sort user post list by date
		userPostsList = userPostsList.sort(
			(a, b) => parseFloat(b.time) - parseFloat(a.time)
		)
		let userPosts = <Alert variant="danger">Ooops</Alert>
		// if finished loading
		if (!this.state.loading) {
			// if no posts found for certain user (self or some random user)
			if (this.props.forSelf && userPostsList.length == 0) {
				return (
					<Card className="post--container mb-4 w-100 align-items-center justify-content-center">
						<Card.Body>
							<div>No posts found :(</div>
						</Card.Body>
					</Card>
				)
			}
			// if no friends found for current user
			if (!this.props.forSelf && userPostsList.length == 0) {
				return (
					<Card className="post--container mb-4 w-100 align-items-center justify-content-center">
						<Card.Body>
							<div>No friends to show posts from :(</div>
						</Card.Body>
					</Card>
				)
			}
			// if neither of those, show list of posts
			userPosts = userPostsList.map((post) => {
				return <PostCard key={post.post} array={post} />
			})
		}
		return <Stack className="col-md-6 mx-auto">{userPosts}</Stack>
	}
}

export default Post
