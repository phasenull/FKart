import React from "react"
import { Button, Divider, IconButton, Surface, Text, TextInput } from "react-native-paper"
import { FKart } from "../../network/FKart"

import { Translated } from "../../util"
import { RegionChooser } from "../special/RegionChooser"
export function PANEL_Account(props) {
	const { navigation } = props
	const [data, set_data] = React.useState({
		username: undefined,
		token: undefined,
		id: undefined,
	})
	React.useEffect(() => {
		async function get() {
			const user = await FKart.GetUser()
			set_data(user)
		}
		get()
	}, [])

	return (
		<Surface className="w-96 mx-auto my-auto p-5 rounded-xl">
			<Text variant="headlineMedium">{Translated("account")}</Text>
			<Divider className="my-2" />
			<Surface mode="flat" className="grid gap-3">
				<Text variant="bodyMedium">Basic Info</Text>
				<TextInput disabled mode="flat" label={Translated("username")} value={data?.username || "???"}></TextInput>
				{/* <TextInput disabled mode="flat" label={Translated("email")} value={data. || "???"}></TextInput> */}
				{/* logout */}
				<RegionChooser className="w-64 self-center" />
				<Button
					mode="contained"
					className="w-1/2 self-center"
					onPress={async () => {
						navigation.replace("Auth",{lock_move:true})
					}}
				>
					Title Screen
				</Button>
				
				<Button
					mode="contained"
					className="w-1/3 self-center"
					labelStyle={{ color: "white"}}
					buttonColor="red"
					onPress={async () => {
						console.log("LOGGING OUT")
						await FKart.LogOut()
						navigation.navigate("Auth")
					}}
				>
					Log Out
				</Button>
			</Surface>
		</Surface>
	)
}
