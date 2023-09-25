import React, { useEffect } from "react"
import { ScrollView, View } from "react-native"
import { Button, Chip, Dialog, Divider, IconButton, List, Portal, ProgressBar, SegmentedButtons, Surface, Text, Title } from "react-native-paper"
import { Translated } from "../../../util"
import { LoadingIndicator } from "../LoadingIndıcator"

export function TimeTable(props) {
	const { navigation } = props
	const params = props.route.params
	const bus_data = params?.bus_data
	const route_no = bus_data?.displayRouteCode
	const [loading, set_loading] = React.useState(false)
	const [data, set_data] = React.useState(undefined)
	const [parameters, set_parameters] = React.useState({ work_days: null })
	const [route_info, set_route_info] = React.useState(null)
	const [direction, set_direction] = React.useState(false)
	useEffect(() => {
		const url = `https://service.kentkart.com/rl1//web/pathInfo?region=004&lang=tr&authType=4&direction=${
			direction === true ? "1" : "0"
		}&displayRouteCode=${route_no}&resultType=111111` //111111
		async function get() {
			set_loading(true)
			const response = await fetch(url)
			const json = JSON.parse(await response.text())
			set_data(json?.pathList[0] || [])
			set_loading(false)
		}
		get()
	}, [direction])
	useEffect(() => {
		get_today_type()
	}, [])

	function get_today_type() {
		const date = new Date()
		const day = date.getDay()
		let return_value = ""
		switch (day) {
			case 6:
				return_value = "mtwtfSs"
				break
			case 7:
				return_value = "mtwtfsS"
				break
			default:
				return_value = "MTWTFss"
				break
		}
		set_parameters({ ...parameters, work_days: return_value })
		return return_value
	}
	return (
		<React.Fragment>
			<Portal>
				<Dialog
					onDismiss={() => {
						set_route_info(null)
					}}
					visible={route_info}
				>
					<Text
					className="px-5">{route_info}</Text>
					<Dialog.Actions>
						<Button
							onPress={() => {
								set_route_info(null)
							}}
						>
							{Translated("ok")}
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
			<Title className="font-bold text-lg">{data ? data.headSign : "Loading..."}</Title>
			<SegmentedButtons
				className="mx-10 inline-block"
				value={parameters.work_days}
				onValueChange={(value) => set_parameters({ ...parameters, work_days: value })}
				buttons={[
					{
						value: "MTWTFss",
						label: "Weekdays",
					},
					{
						value: "mtwtfSs",
						label: "Saturday",
					},
					{
						value: "mtwtfsS",
						label: "Sunday",
					},
				]}
			/>
			<IconButton
				onPress={() => {
					set_direction(!direction)
				}}
				className="inline-block self-end m-3"
				icon="arrow-left-right"
				mode="contained"
			/>
				<ScrollView className="h-96 mb-5" showsHorizontalScrollIndicator={false}>
					{loading ? (
						<LoadingIndicator />
					) : (
						data?.scheduleList
							.find((a) => a.description === parameters.work_days)
							?.timeList.map((e) => (
								<React.Fragment>
									<View key={e.departureTime}>
										<Button className="w-48 h-max" onPress={() => {}}>
											{e.departureTime || "INVALID TIME"}
										</Button>
										{e.tripHeadSign !== "" ? (
											<IconButton
												className="right-0"
												icon={"information-outline"}
												onPress={() => {
													if (e.tripHeadSign !== "") {
														set_route_info(e.tripHeadSign)
													}
												}}
											></IconButton>
										) : null}
									</View>
									<Divider key={`${e.departureTime}-divider`} />
								</React.Fragment>
							))
					)}
				</ScrollView>
		</React.Fragment>
	)
}
