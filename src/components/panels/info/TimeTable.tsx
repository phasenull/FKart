import React, { useEffect } from "react"
import { ScrollView, View, FlatList } from "react-native"
import {
	Button,
	Chip,
	Dialog,
	Divider,
	IconButton,
	List,
	Portal,
	ProgressBar,
	SegmentedButtons,
	Surface,
	Text,
	Title,
	TouchableRipple,
} from "react-native-paper"
import { Translated } from "../../../util"
import { LoadingIndicator } from "../LoadingIndicator"
import { Retry } from "../Retry"

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
	async function get() {
		set_loading(true)
		const url = `https://service.kentkart.com/rl1//web/pathInfo?region=004&lang=tr&authType=4&direction=${
			direction === true ? "1" : "0"
		}&displayRouteCode=${route_no}&resultType=111111` //111111
		const response = await fetch(url)
			.then(async (data) => {
				return await data.json()
			})

			.catch((e) => {
				set_data([])
				set_loading(false)
				console.log("TimeTable", e.message)
				return
			})
		set_data(response?.pathList[0] || [])
		set_loading(false)
	}
	useEffect(() => {
		get()
	}, [direction])
	useEffect(() => {
		navigation.setOptions({
			title: `${Translated("route")} - ${route_no}`,
		})
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
		<Surface className="h-full">
			<Portal>
				<Dialog
					onDismiss={() => {
						set_route_info(null)
					}}
					visible={route_info}
				>
					<Text className="px-5">{route_info}</Text>
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
			<Title className="font-bold text-lg self-center my-4">{data ? data.headSign : "Loading..."}</Title>
			<View className="h-16 py-auto">
				<SegmentedButtons
					className="absolute my-auto mr-12 ml-4"
					value={parameters.work_days}
					onValueChange={(value) => {
						set_parameters({ ...parameters, work_days: value })
					}}
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
					className="absolute my-auto mr-4 self-end"
					icon="arrow-left-right"
					mode="contained"
				/>
			</View>
			{loading ? (
				<LoadingIndicator />
			) : (
				<FlatList
					data={data?.scheduleList?.find((a) => a.description === parameters.work_days)?.timeList}
					showsHorizontalScrollIndicator={false}
					renderItem={({ item }) => {
						return (
							<React.Fragment key={`${item.departureTime}-${Math.random()}`}>
								<View key={`${item.departureTime}-${Math.random()}`}>
									<TouchableRipple className="w-full text-left mr-12 h-10 self-start" onPress={() => {}}>
										<Text className="font-bold text-xl self-center my-auto" style={{color:`#${item.patternColor || 'fff'}`}}>{item.departureTime || "INVALID TIME"}</Text>
									</TouchableRipple>
									{item.tripHeadSign !== "" ? (
										<IconButton
											className="absolute my-auto -bottom-[4px] self-end"
											icon={"information-outline"}
											onPress={() => {
												console.log(item)
												if (item.tripHeadSign !== "") {
													set_route_info(item.tripHeadSign)
												}
											}}
										></IconButton>
									) : null}
								</View>
								<Divider key={`divider-${item.departureTime}-${Math.random()}`} className="z-[5]" />
							</React.Fragment>
						)
					}}
				>
					<Retry
						error={"Server responded with invalid data"}
						onPress={() => {
							get()
						}}
					/>
					)
				</FlatList>
			)}
		</Surface>
	)
}
