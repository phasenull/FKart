import React from "react"
import { Appbar, Button, IconButton, Paragraph, SegmentedButtons, Surface, Text, Title } from "react-native-paper"
import { TimeTable } from "../components/panels/info/TimeTable"
import { BusInfo } from "../components/panels/info/BusInfo"
import { CardInfo } from "../components/panels/info/CardInfo"
export default function Info(props) {
	const { navigation } = props
	const params = props.route?.params
	const pages = [
		{ name: "TimeTable", component: <TimeTable {...props} /> },
		{ name: "BusInfo", component: <BusInfo {...props} /> },
		{ name: "CardInfo", component: <CardInfo {...props} /> },
	]

	return (
		<Surface className="h-full">
			{params?.page ? (
				pages.find((e) => e.name === params?.page)?.component
			) : (
				<React.Fragment>
					<Text className="mx-auto my-auto text-[48] font-bold">OOPS! Nothing to find here</Text>
				</React.Fragment>
			)}
		</Surface>
	)
}
