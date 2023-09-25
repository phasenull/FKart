import React from "react"
import { Button, Divider, IconButton, Surface, Text, TextInput } from "react-native-paper"
import { FCard } from "../../network/FCard"

import { Translated } from "../../util"
export function PANEL_Account(props) {
	const { navigation } = props
	const [data, set_data] = React.useState({
		username: "",
		token: "",
		id: "",
	})
	React.useEffect(() => {
		async function get() {
			const user = await FCard.GetUser()
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
				<TextInput disabled mode="flat" label={Translated("username")} value={data.username || "???"}></TextInput>
				{/* <TextInput disabled mode="flat" label={Translated("email")} value={data. || "???"}></TextInput> */}
				{/* logout */}
				<Button
					mode="contained"
					buttonColor="red"
					onPress={async () => {
						console.log("LOGGING OUT")
						await FCard.LogOut()
						navigation.navigate("Auth")
					}}
				>
					Log Out
				</Button>
			</Surface>
		</Surface>
	)
}
