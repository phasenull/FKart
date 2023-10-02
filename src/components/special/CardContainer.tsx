import { Badge, IconButton, Surface, Text } from "react-native-paper"
import React, { useEffect, useRef, useState } from "react"
import Card from "../../network/Card"
import { Image, Animated, View, PanResponder } from "react-native"
import { FKart } from "../../network/FKart"
import { Translated } from "../../util"
export function CardContainer(props) {
	const card: Card = props.card
	const { navigation } = props
	const images = {
		"00": require("../../assets/media/cards/ogrenci.png"),
		"01": require("../../assets/media/cards/tam.png"),
		"02": require("../../assets/media/cards/basin.png"),
		"03": require("../../assets/media/cards/yas65.png"),
		"04": require("../../assets/media/cards/yas60.png"),
	}
	const [card_image, set_card_image] = useState(null)
	useEffect(() => {
		set_card_image(images["0" + Math.floor(Math.random() * 5).toString()])
	}, [])
	const DELETE_OFFSET = 160
	const [show, set_show] = useState(true)
	const container_data = useRef({
		visible: true,
		swipe_size: 0,
	})
	const [swipe_size] = useState(new Animated.Value(0))
	const pan_responder = PanResponder.create({
		onMoveShouldSetPanResponder: () => true,
		onPanResponderMove: (e, gesture) => {
			if (-gesture.dx > 0) {
				swipe_size.setValue(-gesture.dx)
				container_data.current.swipe_size = Number.parseInt(JSON.stringify(swipe_size))
			}
		},
		onMoveShouldSetPanResponderCapture: () => true,
		onPanResponderEnd(e, gestureState) {
			swipe_size.setValue(0)
			if (container_data.current.swipe_size / DELETE_OFFSET > 1) {
				HandleDelete()
				console.log("swipe_%", container_data.current.swipe_size / DELETE_OFFSET)
			}
		},
	})
	const { set_locked } = props
	async function HandleDelete() {
		console.log(`Deleting card ${card.alias} "${card.description}"`)
		const region = await FKart.GET_DATA("region")
		const fav_id = card.favorite_id
		const user = await FKart.GetUser()
		set_show(false)
		const response = await user.DeleteFavorite({ favId: fav_id, region_id: region.id })
		console.log(response)
	}
	const Clamp = (num, min, max) => Math.min(Math.max(num, min), max)
	return show ? (
		<Animated.View
			{...pan_responder.panHandlers}
			style={{
				// right: swipe_size,
				transform: [
					{ rotateY: swipe_size.interpolate({ inputRange: [0, DELETE_OFFSET], outputRange: [`0deg`, `-180deg`], extrapolate: `clamp` }) },
					{ scale: swipe_size.interpolate({ inputRange: [DELETE_OFFSET, DELETE_OFFSET * 1.1], outputRange: [1, 0.9], extrapolate: `clamp` }) },
				],
			}}
		>
			<Surface key={card.alias} mode="flat" className={"h-32 w-80 self-center mt-5 p-5 rounded-[16px]"}>
				{
					<Animated.View
						{...pan_responder.panHandlers}
						className={`overflow-hidden absolute self-center h-32 w-80 z-[2] bg-["ff0000"] rounded-[16px]`}
						style={{
							opacity: swipe_size.interpolate({ inputRange: [DELETE_OFFSET / 2 - 0.01, DELETE_OFFSET / 2], outputRange: [0, 1], extrapolate: `clamp` }),
							// 33FF71 - green
							backgroundColor: swipe_size.interpolate({
								inputRange: [DELETE_OFFSET * 0.9, DELETE_OFFSET * 0.9 + 0.01],
								outputRange: [`#ff0000`, `#ff0000`],
								extrapolate: `clamp`,
							}), 
							zIndex:swipe_size.interpolate({
								inputRange: [DELETE_OFFSET / 2, DELETE_OFFSET / 2 + 0.01],
								outputRange: [-1, 5],
								extrapolate: `clamp`,
							}), 
							transform: [{ rotateY: "180deg" }],
						}}
					>
						<Text className="inline text-center self-center mt-auto mb-3 font-bold text-[32px]">{Translated("remove")}</Text>
						<Text className="inline text-center self-center mb-auto bottom-3 font-bold text-[20px]">"{card.description}"?</Text>
						<Animated.Text
							style={{
								opacity: swipe_size.interpolate({ inputRange: [DELETE_OFFSET * 0.95, DELETE_OFFSET * 1+0.01], outputRange: [0.4,0], extrapolate: `clamp` }),
								right: swipe_size.interpolate({ inputRange: [DELETE_OFFSET / 2, DELETE_OFFSET], outputRange: ["0%", "85%"], extrapolate: `clamp` }),
							}}
							
							className="absolute text-[128px] text-white translate-x-24 -bottom-3 z-[-1]"
						>
							{"<<<"}
						</Animated.Text>
					</Animated.View>
				}
				<Animated.View
					className="absolute self-start right-28 my-auto z-[3]"
					style={{
						opacity: swipe_size.interpolate({ inputRange: [DELETE_OFFSET / 2 - 0.01, DELETE_OFFSET / 2], outputRange: [1, 0], extrapolate: `clamp` }),
					}}
				>
					{card_image ? <Image className={"scale-[0.35] bottom-14 right-4 rotate-90"} source={card_image} /> : null}
				</Animated.View>
				{card.blacklist_status ? (
					<View className="absolute self-start right-28 z-[4]">
						{card_image ? <Image className={"scale-[0.35] botom-14 right-4 rotate-90 opacity-70"} style={{ tintColor: "black" }} source={card_image} /> : null}
					</View>
				) : null}
				<View pointerEvents="none" className="pl-20 my-auto">
					<Text className="self-start mt-5 bottom-3 text-lg">{card.description}</Text>
					<Text className="self-start font-bold mb-5 text-[28px]">{card.balance} TL</Text>
				</View>
				{card.blacklist_status ? (
					<Text className="absolute self-start text-red-600 rotate-[-15deg] font-bold text-[52px] self-center top-[40%]">Kara Liste</Text>
				) : null}
				{card.loads_in_line?.length ? <Badge className="absolute self-end -top-1 -right-1 scale-[1.25]">{card.loads_in_line?.length}</Badge> : null}
				<IconButton
					onPress={() => {
						navigation.push("Info", { page: "CardInfo", card: card, image: card_image })
					}}
					icon="chevron-right"
					size={36}
					className="absolute opacity-30 w-8 h-32 self-end -bottom-1"
				/>
			</Surface>
		</Animated.View>
	) : null
}
