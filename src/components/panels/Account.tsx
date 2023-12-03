import React, { useRef, useState } from "react"
import { Button, Divider, IconButton, Paragraph, Surface, Text, TextInput } from "react-native-paper"
import { FKart } from "../../network/FKart"

import { Translated } from "../../util"
import { RegionChooser } from "../special/RegionChooser"
import { RefreshControl, ScrollView } from "react-native"
import Card from "../../network/Card"
import { CardContainer } from "../special/CardContainer"
import { LoadingIndicator } from "./LoadingIndicator"

export function PANEL_Account(props) {
	const { navigation } = props
	const [data, set_data] = React.useState({
		username: undefined,
		token: undefined,
		id: undefined,
		favorites: undefined,
		region: undefined,
		cards: undefined,
	})
	const [locked, set_locked] = useState(false)
	const items = useRef(null)
	const [show_sensitive_data, set_show_sensitive_data] = useState(false)
	const [loading, set_loading] = React.useState(false)
	async function get() {
		set_loading(true)
		const user = await FKart.GetUser()
		const region = await FKart.GET_DATA("region")
		set_data({ ...data, ...user, region: region })
		const favorites = await user.GetFavorites(region.id)
		const favorites_list: Array<undefined> = favorites.userFavorites

		const card_list: Array<undefined> = favorites_list?.filter((e: any) => e.typeDescription === "Card")
		if (!card_list) {
			set_loading(false)
			return
		};
		const oop_card_list = await Promise.all(
			card_list.map(async (e: { favorite: any }) => {
				const card_data = await (await fetch_card(e)).json()
				const new_card = Card.fromJSON({ ...card_data.cardlist[0], ...e })
				return new_card
			})
		)

		if (favorites) {
			set_data({
				...data,
				...user,
				favorites: { ...favorites.userFavorites, ...favorites.virtualCards },
				cards: oop_card_list,
			})
		}
		async function fetch_card(e: { favorite: string }) {
			return Card.FETCH_CARD_DATA({ region: region.id, alias: e.favorite, token: user.token })
		}
		items.current = oop_card_list?.map((e: Card) => (
			<CardContainer set_locked={set_locked} key={e.alias + Math.random().toString()} navigation={navigation} card={e} />
		))
		set_loading(false)
	}
	async function get_settings() {
		const setting_data = await FKart.GET_DATA("show_sensitive_information")
		set_show_sensitive_data(setting_data)
	}
	React.useEffect(() => {
		get()
	}, [])
	
	return (
			<ScrollView
				scrollEnabled={!locked}
				refreshControl={<RefreshControl refreshing={false} onRefresh={get} />}
				showsHorizontalScrollIndicator={false}
			>
				<Text className={"text-center text-4xl font-bold py-5 -mb-5"}>Favorilerim</Text>
				{loading ? <LoadingIndicator /> : items.current}

				<Surface mode="flat" className="w-80 my-16 mx-auto p-5 rounded-xl">
					<Text variant="headlineMedium">{Translated("account")}</Text>
					<Divider className="my-2" />
					<Surface mode="flat" className="grid gap-3">
						<Text variant="bodyMedium">{Translated("basic_info")}:</Text>
						<TextInput
							disabled
							mode="flat"
							label={Translated("username")}
							value={data?.username ? (show_sensitive_data && data?.username) || "***" : "NOT LOGGED IN"}
						></TextInput>
						{/* <TextInput disabled mode="flat" label={Translated("email")} value={data. || "???"}></TextInput> */}
						{/* logout */}
						<RegionChooser className="w-64 self-center" />
						<Button
							mode="contained"
							className="w-max self-center"
							onPress={async () => {
								navigation.replace("Auth", { lock_move: true })
							}}
						>
							{Translated("go_to_title_screen")}
						</Button>

						<Button
							mode="contained"
							className="self-center"
							labelStyle={{ color: "white" }}
							buttonColor="red"
							onPress={async () => {
								console.log("LOGGING OUT")
								await FKart.LogOut()
								navigation.navigate("Auth")
							}}
						>
							{Translated("logout")}
						</Button>
					</Surface>
				</Surface>
			</ScrollView>
	)
}
