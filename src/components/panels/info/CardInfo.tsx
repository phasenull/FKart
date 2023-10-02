import { Button, Dialog, Divider, Portal, Surface, Text, Title, TextInput } from "react-native-paper"
import React from "react"
import { ScrollView, View, DeviceEventEmitter, RefreshControl, FlatList, Dimensions } from "react-native"
import { Image } from "react-native"
import { useClipboard } from "@react-native-clipboard/clipboard"
import Clipboard from "@react-native-clipboard/clipboard"
import { FKart } from "../../../network/FKart"
import Card from "../../../network/Card"
const { width } = Dimensions.get("window")
const page_count = 2
const divider = <Divider className="my-2 self-center w-80" />
import { LoadingIndicator } from "../LoadingIndicator"
export function CardInfo(props) {
	const params = props.route?.params
	const card = params?.card
	const image = params?.image
	const { navigation } = props
	const [data, set_data] = React.useState(card)
	const [form_data, set_form_data] = React.useState({ rename: { visible: false, value: "" } })

	function toggle_form_data(key) {
		set_form_data({ ...form_data, [key]: { visible: !form_data[key].visible } })
	}
	React.useEffect(() => {
		navigation.setOptions({ title: `${card.description} - ${card.alias}` })
	}, [])
	function get_relative_time(date) {}
	const [refresh_controller, set_refresh_controller] = React.useState(false)
	DeviceEventEmitter.addListener("refresh", () => {})

	async function get() {
		set_refresh_controller(true)

		const user = await FKart.GetUser()
		const region = await FKart.GET_DATA("region")
		const card_data = await Card.fromAlias({ region: region.id, alias: card.alias, token: user.token })
		console.log("card data", card_data)
		const this_year = new Date().getFullYear()
		const this_month = new Date().getMonth()
		console.log("this date", this_year, this_month)
		const transaction_list = await card_data.GetTransactions({ year: this_year, month: this_month })
		const new_data = await card_data
		set_data({ ...new_data, ...{ transactions: transaction_list } })

		set_refresh_controller(false)
	}
	function get_total() {
		if (!data.transactions) return 0
		const usages = data.transactions.filter((e) => e.type == 1)
		let total = 0
		usages.forEach((e) => (total += parseFloat(e.usageAmt)))
		return total
	}
	React.useEffect(() => {
		get()
	}, [])
	const [scroll_index, set_scroll_index] = React.useState(0)
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
			<Portal>
				{/* RENAME ACTION DIALOG */}
				<Dialog
					visible={form_data.rename.visible}
					onDismiss={() => {
						toggle_form_data("rename")
					}}
				>
					<Dialog.Title>Yeni isim girin</Dialog.Title>
					<Dialog.Content>
						<Text className="text-[18px] font-bold self-center mb-3">
							"{data.description}" <Text className="text-[16px]">için yeni isim girin:</Text>
						</Text>
						<TextInput
							className="w-64 self-center"
							defaultValue={data.description}
							placeholder="My New Card"
							onChangeText={(text) => {
								set_form_data({ ...form_data, rename: { ...form_data.rename, value: text } })
							}}
						/>
					</Dialog.Content>
					<Dialog.Actions>
						<Button
							onPress={() => {
								toggle_form_data("rename")
							}}
						>
							Cancel
						</Button>
						<Button
							onPress={() => {
								const card: Card = data
								card.Rename({ new_description: form_data.rename.value, alias: card.alias })
								toggle_form_data("rename")
								get()
							}}
						>
							Confirm
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
			<Image className={"scale-[1] self-center left-2"} source={image} />
			{refresh_controller ? (
				<LoadingIndicator />
			) : (
				<React.Fragment>
					<Title className="self-center font-bold mb-2 text-[24px]">{data.description}</Title>
					<Text className="bg-cyan-600 rounded-full px-3 self-center text-md font-bold" selectable={true}>
						{data.alias}
					</Text>
					<Text className="self-center text-[48px] font-bold">{data.balance} TL</Text>
					{divider}
					{/* usagse */}
					<View className="self-center gap-y-1">
						<View className="gap-x-3">
							<Text className="text-[18px]">Son Yükleme: {data.last_usages[1].amt} TL</Text>
							<Text className="text-[12px] self-center opacity-50">{data.last_usages[1].date}</Text>
						</View>
						<View className="gap-x-3">
							<Text className="text-[18px]">Son Kullanım: {data.last_usages[0].amt} TL</Text>
							<Text className="text-[12px] self-center opacity-50">{data.last_usages[0].date}</Text>
						</View>
					</View>
					{/* horizontal */}
					<ScrollView
						pagingEnabled={true}
						showsHorizontalScrollIndicator={false}
						horizontal={true}
						className="h-max"
						onScroll={(e) => {
							let pageNumber = Math.min(Math.max(Math.floor(e.nativeEvent.contentOffset.x / width + 0.5) + 1, 0), 2)
							if (pageNumber-1 === scroll_index) return
							console.log("page number", pageNumber - 1)
							set_scroll_index(pageNumber - 1)
						}}
					>
						{/* usages */}
						<View style={{ width: width }}>
							<Surface mode="flat" elevation={2} className="w-80 self-center py-3 px-5 mt-2 rounded-[16px]">
								<Title className="text-[16px]">
									{data.transactions ? `Kullanımlar (${data.transactions?.length}x / ${get_total()} TL):` : "Bu aya ait kullanım bulunmamaktadır."}
								</Title>
								{data.transactions ? (
									<FlatList
										nestedScrollEnabled={true}
										scrollEnabled={true}
										data={data?.transactions}
										style={{ maxHeight: 300 }}
										className="mt-3 px-1"
										renderItem={({ item }) => {
											const date = item.formattedDate
											const type = item.type
											return (
												<View style={{ flexDirection: "row", flexWrap: "wrap" }} key={item.boardingDateTime + Math.random().toString()} className="justify-between gap-x-5">
													<Text className="text-[18px]" style={{ color: `${item.type == "1" ? "red" : "green"}` }}>
														{(type && item.usageAmt) || item.amount || "??"} TL
													</Text>
													<Text className="opacity-20 text-sm">{date || "???"}</Text>
												</View>
											)
										}}
									></FlatList>
								) : null}
							</Surface>
						</View>
						{/* loads in line */}
						<View style={{ width: width }}>
							<Surface mode="flat" elevation={2} className="h-max w-80 self-center h-max-48 py-3 px-5 mt-2 rounded-[16px]">
								<Title className="text-[16px]">{data.loads_in_line ? `Bekleyen yüklemeler (${data.loads_in_line?.length}):` : "Bekleyen yükleme bulunmamaktadır."}</Title>
								{data.loads_in_line ? (
									<ScrollView className="gap-y-3 mt-3">
										{data.loads_in_line?.map((e) => (
											<View key={e.datetime + Math.random().toString()} className="flex flex-col px-5">
												<Text className="text-[18px]">
													{e.datetime || "???"} - {e.amount || "??"} TL
												</Text>
											</View>
										))}
									</ScrollView>
								) : null}
							</Surface>
						</View>
					</ScrollView>
					{/* scroll previewer */}
					<View className="self-center gap-x-1 my-5" style={{ flexWrap: "wrap", flexDirection: "row" }}>
						{[...Array(page_count)].map((e, i) => (
							<View className={`w-2 h-2 bg-gray-400 self-center rounded-full ${scroll_index === i ? "opacity-100 w-3 h-3" : "opacity-50"}`} />
						))}
					</View>
					{divider}
					{/* actions */}
					<View className="mt-3 mb-10">
						<Button
							mode="contained-tonal"
							className="self-center rounded-xl"
							icon={"pencil"}
							onPress={() => {
								toggle_form_data("rename")
							}}
						>
							Rename
						</Button>
					</View>
				</React.Fragment>
			)}
		</ScrollView>
	)
}
