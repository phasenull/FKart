import { Button, Dialog, Divider, Portal, Surface, Text, Title, TextInput, IconButton } from "react-native-paper"
import React from "react"
import { ScrollView, View, DeviceEventEmitter, RefreshControl, FlatList, Dimensions } from "react-native"
import { Image } from "react-native"
import { useClipboard } from "@react-native-clipboard/clipboard"
import Clipboard from "@react-native-clipboard/clipboard"
import { FKart } from "../../../network/FKart"
import Card from "../../../network/Card"
import { LoadingIndicator } from "../LoadingIndicator"
import { CardInfoPortal } from "../../special/Info/CardInfo/Portal"
import { CardInfoHorizontalView } from "../../special/Info/CardInfo/HorizontalView"
export function CardInfo(props) {
	const params = props.route?.params
	const card = params?.card
	const image = params?.image
	const { navigation } = props
	const [data, set_data] = React.useState(card)
	const divider = <Divider className="my-5 self-center w-80" />
	const [refresh_controller, set_refresh_controller] = React.useState(false)
	const [form_visible, set_form_visible] = React.useState(false)
	async function get() {
		set_refresh_controller(true)

		const user = await FKart.GetUser()
		const region = await FKart.GET_DATA("region")
		const card_data = await Card.fromAlias({ region: region.id, alias: card.alias, token: user.token })
		set_data(card_data)
		set_refresh_controller(false)
	}
	React.useEffect(() => {
		console.log("Rendering CardInfo", card.alias)
		navigation.setOptions({ title: `${card.description} - ${card.alias}` })
		get()
	}, [])
	const turn_on_portal = () => set_form_visible(true)
	const turn_off_portal = () => set_form_visible(false)
	React.useEffect(() => {
		console.log("CardInfo data changed", data.description)
	}, [data])
	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={refresh_controller}
					onRefresh={() => {
						get()
					}}
				></RefreshControl>
			}
		>
			{/* FORM DATA */}
			{form_visible ? (
				<CardInfoPortal
					get={get}
					data={data}
					onDissmiss={() => {
						set_form_visible(false)
					}}
					setVisible={set_form_visible}
				/>
			) : null}
			<View className="self-center">
				<Image key="image" className={"scale-[1] self-center left-2"} source={image} />
				<IconButton className="absolute right-4 mr-4 mt-4" onPress={()=>{}} icon={"image"} />
			</View>
			{refresh_controller ? (
				<LoadingIndicator />
			) : (
				<React.Fragment>
					<Title key={"title"} className="self-center font-bold mb-2 text-[24px]">
						{data.description}
					</Title>
					<Text key="alias" className="bg-cyan-600 rounded-full px-3 self-center text-md font-bold" selectable={true}>
						{data.alias}
					</Text>
					<Text key={"balance"} className="self-center text-[48px] font-bold">
						{data.balance} TL
					</Text>
					{divider}
					{/* actions */}
					<View style={{ flexWrap: "wrap", flexDirection: "row" }} className="my-auto self-center w-80 justify-center gap-5">
						<Button mode="contained-tonal" className="self-center rounded-xl" icon={"pencil"} onPress={turn_on_portal}>
							Rename
						</Button>
						<Button buttonColor="green" mode="contained-tonal" className="self-center rounded-xl" icon={"cash-plus"} onPress={turn_on_portal}>
							Load
						</Button>
						<Button buttonColor="red" mode="contained-tonal" className="self-center rounded-xl" icon={"star-off"} onPress={turn_on_portal}>
							Remove
						</Button>
						{/* <Button
							buttonColor="red"
							mode="contained-tonal"
							className="self-center rounded-xl"
							icon={"star-off"}
							onPress={turn_on_portal}
						>
							Remove
						</Button> */}
					</View>
					{divider}
					{/* usagse */}
					{/* <View key={"usages"} className="self-center gap-y-1">
						<View className="gap-x-3">
							<Text className="text-[18px]">Son Yükleme: {data.last_usages[1].amt} TL</Text>
							<Text className="text-[12px] self-center opacity-50">{data.last_usages[1].date}</Text>
						</View>
						<View className="gap-x-3">
							<Text className="text-[18px]">Son Kullanım: {data.last_usages[0].amt} TL</Text>
							<Text className="text-[12px] self-center opacity-50">{data.last_usages[0].date}</Text>
						</View>
					</View> */}
					{/* horizontal */}
					<CardInfoHorizontalView data={data} get={get} />
				</React.Fragment>
			)}
		</ScrollView>
	)
}
