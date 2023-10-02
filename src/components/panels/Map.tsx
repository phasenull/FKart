import React, { useRef, useState } from "react"
import { Button, Divider, IconButton, Paragraph, Surface, Text, TextInput } from "react-native-paper"
import { FKart } from "../../network/FKart"

import { Translated } from "../../util"
import { RegionChooser } from "../special/RegionChooser"
import { RefreshControl, ScrollView } from "react-native"
import Card from "../../network/Card"
import { CardContainer } from "../special/CardContainer"
import { LoadingIndicator } from "./LoadingIndicator"

import { Image, Animated, View, PanResponder } from "react-native"
export function PANEL_Map(props) {
	const [map_position] = useState(new Animated.ValueXY({ x: 0, y: 0 }))
	const pan_responder = PanResponder.create({
		onMoveShouldSetPanResponder: () => true,
		onPanResponderMove: (e, gesture) => {
			map_position.setValue({ x: gesture.moveX, y: gesture.moveY })
			// if (-gesture.dx > 0) {
			// 	map_position.setValue(-gesture.dx)
			// 	container_data.current.map_position = Number.parseInt(JSON.stringify(map_position))
			// }
		},
		onMoveShouldSetPanResponderCapture: () => true,
		onPanResponderEnd(e, gestureState) {
			// map_position.setValue(0)
			// if (container_data.current.map_position / DELETE_OFFSET > 1) {
			// 	HandleDelete()
			// 	console.log("swipe_%", container_data.current.map_position / DELETE_OFFSET)
			// }
		},
	})
	const { navigation } = props
	const [data, set_data] = React.useState({
		username: undefined,
		token: undefined,
		id: undefined,
		favorites: undefined,
		region: undefined,
		cards: undefined,
	})
	
	const [loading, set_loading] = React.useState(false)
	async function get() {
		set_loading(true)
		const user = await FKart.GetUser()
		const region = await FKart.GET_DATA("region")
		set_loading(false)
	}
	React.useEffect(() => {
		get()
	}, [])
	return (
		<Animated.View
			{...pan_responder.panHandlers}
			style={{
				// right: map_position,
				position: "absolute",
				transform: [{ translateX: map_position.x }, { translateY: map_position.y }],
			}}
			className={"bottom-32"}
		>
			<View className="h-32 w-32 bg-red-400"></View>
		</Animated.View>
	)
}
