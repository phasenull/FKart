import React from "react"
import { Appbar, Button, IconButton, Paragraph, SegmentedButtons, Surface, Text, Title } from "react-native-paper"
import { TimeTable } from "../components/panels/info/TimeTable"
import { BusInfo } from "../components/panels/info/BusInfo"
import { CardInfo } from "../components/panels/info/CardInfo"
import { EventEmitter, FlatList, RefreshControl, ScrollView, DeviceEventEmitter } from "react-native"
import { Retry } from "../components/panels/Retry"
import { LoadingIndicator } from "../components/panels/LoadingIndicator"
export default function Info(props) {
	const { navigation } = props
	const params = props.route?.params
	const [refresh_controller, set_refresh_controller] = React.useState(false)
	const pages = [
		{ name: "TimeTable", component: <TimeTable refreshController={[refresh_controller, set_refresh_controller]} {...props} /> },
		{ name: "BusInfo", component: <BusInfo refreshController={[refresh_controller, set_refresh_controller]} {...props} /> },
		{ name: "CardInfo", component: <CardInfo refreshController={[refresh_controller, set_refresh_controller]} {...props} /> },
	]
	return (
		<Surface
			className="h-full"
		>
			{params?.page ? (
				pages.find((e) => e.name === params?.page)?.component
			) : (
				<React.Fragment>
					<Text className="mx-auto my-auto text-[48] font-bold">OOPS! Nothing to find here.</Text>
					<Retry
						onPress={() => {
							DeviceEventEmitter.emit("refresh")
						}}
					/>
				</React.Fragment>
			)}
		</Surface>
	)
}
