import React, { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import { db } from "../firebase/firebase"
import { doc, getDoc } from "firebase/firestore"

function PostCard(props) {
	const [userHandle, setUserHandle] = useState("")
	const DIVISIONS = [
		{ amount: 60, name: "seconds" },
		{ amount: 60, name: "minutes" },
		{ amount: 24, name: "hours" },
		{ amount: 7, name: "days" },
		{ amount: 4.34524, name: "weeks" },
		{ amount: 12, name: "months" },
		{ amount: Number.POSITIVE_INFINITY, name: "years" },
	]

	const RELATIVE_DATE_FORMATTER = new Intl.RelativeTimeFormat(undefined, {
		numeric: "auto",
	})

	function formatRelativeDate(toDate, fromDate = new Date()) {
		let duration = (toDate - fromDate) / 1000

		for (let i = 0; i < DIVISIONS.length; i++) {
			const division = DIVISIONS[i]
			if (Math.abs(duration) < division.amount) {
				return RELATIVE_DATE_FORMATTER.format(
					Math.round(duration),
					division.name
				)
			}
			duration /= division.amount
		}
	}

	// fetches user handle based on userID
	async function fetchHandle() {
		const docRef = doc(db, "user_info", props.array.user)
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			setUserHandle(docSnap.data().handle)
		} else {
			console.log("No such document!")
		}
	}

	useEffect(() => {
		fetchHandle()
	}, [])

	return (
		<Card className="post--container mb-4 w-100 align-items-center justify-content-center">
			<Card.Body>
				<div>
					<small>
						<i>({formatRelativeDate(props.array.time * 1000)}) </i>
					</small>
					<strong>{userHandle}</strong>: {props.array.post}
				</div>
			</Card.Body>
		</Card>
	)
}

export default PostCard
