import React, { useEffect } from "react"
import { ScrollView } from "react-native"
import { IconButton, List, Searchbar, Surface, Text } from "react-native-paper"
import { FKart } from "../../network/FKart"
import { LoadingIndicator } from "./LoadingIndıcator"
import { Retry } from "./Retry"
export default function RouteCodeSelector(props) {
	const [data, setData] = React.useState({
		bus_list: [],
		selected_bus: null,
		bus_data: [],
	})
	const { navigation } = props
	const [search_query, set_search_query] = React.useState("")
	const [loading, set_loading] = React.useState(false)
	const [error, set_error] = React.useState(null)
	async function get() {
		setData({ ...data, bus_list: undefined })
		set_loading(true)
		set_error(null)
		const region = await FKart.GET_DATA("region")
		const find_data = await fetch(`https://service.kentkart.com/rl1//web/nearest/find?region=${region.id}&lang=tr&authType=4`)
			.then(async (data) => await data.json().catch((e) => console.log("JSON ERROR", e.message)))
			.catch(async (e) => {
				console.log("ERROR", e.message)
				await set_error(e.message)
				set_loading(false)
				return
			})
		set_loading(false)
		if (find_data?.result?.code != 0) {
			if (find_data?.result?.message) {
				console.log("ERROR", find_data?.result?.message)
				set_error(find_data?.result?.message)
			}
			setData({ ...data, bus_list: undefined })
			return
		}

		setData({ ...data, bus_list: find_data.routeList })
	}
	useEffect(() => {
		get()
	}, [])
	const onTextInput = (text) => {
		set_search_query(text)
	}
	return (
		<React.Fragment>
			{loading ? <LoadingIndicator /> : null}
			{(error || !data.bus_list) && !loading ? (
				<Retry error={error} onPress={get} />
			) : data?.bus_list ? (
				<React.Fragment>
					<Searchbar className="mt-3 mx-5" value={search_query || ""} placeholder="Search Routes" onChangeText={onTextInput}></Searchbar>
					<ScrollView className="h-screen">
						{data?.bus_list
							?.filter(
								(e: { displayRouteCode: string; name: string }) =>
									e.displayRouteCode?.match(search_query.toLowerCase()) || e.name?.toLowerCase().match(search_query.toLowerCase())
							)
							.slice(0, 20)
							.map((bus) => (
								<List.Item
									key={bus?.displayRouteCode}
									title={`${bus?.displayRouteCode} - ${bus?.name}`}
									onPress={() => {
										navigation.push("Info", { bus_data: bus, direction: 0 })
									}}
								/>
							))}
					</ScrollView>
				</React.Fragment>
			) : null}
		</React.Fragment>
	)
}
