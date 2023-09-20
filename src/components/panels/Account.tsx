import React from "react"
import { Divider, IconButton, Surface, Text, TextInput } from "react-native-paper"
import { KentiminKarti } from "../../network/KentiminKarti"

import { Translated } from "../../util"
export function PANEL_Account(props) {
	return (
		<Surface className="w-96 mx-auto my-auto p-5 rounded-xl">
			<Text variant="headlineMedium">{Translated("account")}</Text>
			<Divider className="my-2" />
			<Surface mode="flat" className="grid gap-3">
				
				<Text variant="bodyMedium">Basic Info</Text>
				<TextInput disabled mode="flat" label={Translated("username")} value={KentiminKarti.GetUser().name || "???"}></TextInput>
				<TextInput disabled mode="flat" label={Translated("email")} value={KentiminKarti.GetUser().email || "???"}></TextInput>
			</Surface>
		</Surface>
	)
}
