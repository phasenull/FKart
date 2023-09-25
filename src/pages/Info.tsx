import React from "react"
import { Appbar, Button, IconButton, Paragraph, SegmentedButtons, Surface, Text, Title } from "react-native-paper"
import { TimeTable } from "../components/panels/info/TimeTable"
export default function Info(props) {
	const { navigation } = props
	const params = props.route.params
	const bus_data = params?.bus_data
	const route_no = bus_data?.displayRouteCode
	const pages = [{ name: "TimeTable", component: <TimeTable {...props} /> }]
	React.useEffect(() => {
		navigation.setOptions({
			title: `${params?.title || params.page || `Route-${route_no}`}`,
		})
	}, [])

	return (
		<Surface>
			{(params.info_page && pages.find((e) => e.name === params.page)?.component) || (
				<React.Fragment>
					<Title className="text-sm">{`${bus_data.displayRouteCode} - ${bus_data.name} \n`}</Title>
					<IconButton
						className="self-end m-3"
						icon={"clock-time-eight-outline"}
						mode="contained"
						
						onPress={() => {
							navigation.push("Info", { info_page: true, page: "TimeTable", title:`Route-${route_no} : TimeTable`, bus_data: bus_data })
						}}
					></IconButton>
					<Paragraph>{JSON.stringify(bus_data)}</Paragraph>
				</React.Fragment>
			)}
		</Surface>
	)
}
