import React, { useEffect } from "react"
import { ScrollView } from "react-native"
import { List, Searchbar, Surface, Text } from "react-native-paper"
export default function RouteCodeSelector(props) {
	const [data, setData] = React.useState({
		bus_list: [],
		selected_bus: null,
		bus_data: [],
	})
	const { navigation } = props
	const [search_query, set_search_query] = React.useState("")
	const [loading, set_loading] = React.useState(false)
	useEffect(() => {
		async function get() {
			const find_data = await fetch("https://service.kentkart.com/rl1//web/nearest/find?region=004&lang=tr&authType=4")
				.then((response) => response.json())
				.then((json) => {
					return json
				})
			setData({ ...data, bus_list: find_data.routeList })
		}
		get()
	}, [])

	const onTextInput = (text) => {
		set_search_query(text)
	}
	return (
		<React.Fragment>
			<Searchbar className="mt-3 mx-5" value={search_query || ""} placeholder="Search Routes" onChangeText={onTextInput}></Searchbar>
			<ScrollView className="h-screen">
				{data?.bus_list
					.filter(
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
					)) || (
					<React.Fragment>
						<Text>Error</Text>
					</React.Fragment>
				)}
			</ScrollView>
		</React.Fragment>
	)
}
