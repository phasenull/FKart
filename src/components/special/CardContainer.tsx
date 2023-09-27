import { Badge, IconButton, Surface, Text } from "react-native-paper"
import React, { useEffect, useState } from "react"
import Card from "../../network/Card"
import { Image, View } from "react-native"
import { FKart } from "../../network/FKart"
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
	const GRID_OFFSET = 20
	const ROTATE_OFFSET = 70
	const [show, set_show] = useState(true)
	const [delete_size, set_delete_size] = useState(0)
	const { set_locked } = props
	useEffect(() => {
		if (delete_size > 0) {
			set_locked(true)
		} else {
			set_locked(false)
		}
	}, [delete_size])
	async function HandleDelete() {
		console.log(`Deleting card ${card.alias} "${card.description}"`)
		const region = await FKart.GET_DATA("region")
		const fav_id = card.favorite_id
		const user = await FKart.GetUser()
		const response = await user.DeleteFavorite({favId:fav_id,region_id:region.id})
		console.log(response)
	}
	const Clamp = (num, min, max) => Math.min(Math.max(num, min), max)
	return show ? (
		<Surface
			onTouchStart={(e) => {
				this.touchX = e.nativeEvent.pageX
			}}
			onTouchEnd={(e) => {
				if (this.touchX - e.nativeEvent.pageX > DELETE_OFFSET) {
					console.log("Swiped up", delete_size)
					HandleDelete()
					set_show(false)
				}
				set_delete_size(0)
			}}
			onTouchEndCapture={(e) => {
				set_delete_size(0)
			}}
			onTouchCancel={(e) => {
				set_delete_size(0)
			}}
			onTouchMove={(e) => {
				const diff = Math.floor(this.touchX - e.nativeEvent.pageX)
				set_delete_size(diff)
			}}
			style={{
				right: delete_size > 20 ? Clamp(delete_size,20,delete_size*0.7) : 0,
				transform: [
					{ rotateZ: `-${delete_size > ROTATE_OFFSET ? Clamp(Math.abs((delete_size - ROTATE_OFFSET) * 0.4),0,90).toString() : "0"}deg` },
					{ translateX : -(delete_size > DELETE_OFFSET ? (delete_size - DELETE_OFFSET) : 0)}
					// { rotateX: `${delete_size > DELETE_OFFSET ? Math.abs((delete_size - DELETE_OFFSET)).toString() : "0"}deg` },
				],
				zIndex: delete_size > 0 ? 5 : 0
			}}
			key={card.alias}
			mode="flat"
			className={"h-32 w-80 self-center mt-5 p-5 rounded-[16px]"}
		>
			<View className="absolute self-start right-28 my-auto">
			{card_image ? <Image className={"scale-[0.35] bottom-14 right-4 rotate-90"} source={card_image} /> : null }
			</View>
			{card.blacklist_status ? (
				<View className="absolute self-start right-28">
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
	) : null
}