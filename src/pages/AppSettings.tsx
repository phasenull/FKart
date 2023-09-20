import { useState } from "react"
import { Button, Dialog, List, Portal, Surface, Text } from "react-native-paper"
import { KentiminKarti } from "../network/KentiminKarti"
import { Translated } from "../util"
import React from "react"
interface DialogState {
	visible: boolean
	title?: string
	description?: string
	actions?: { clicked: Function; text: string; icon?: string }[]
	icon?: string
}
export function AppSettings(props) {
	const state: DialogState = {
		visible: false,
		title: "INVALID TITLE",
		description: "INVALID DESCRIPTION",
		actions: [],
		icon: null,
	}
	const [loading, set_loading] = useState(false)
	const [dialog_message, set_dialog_message] = useState(state)
	return (
			<Surface className="mx-auto w-[80%] my-auto p-5 rounded-xl">
				<Portal>
					<Dialog
						dismissable={true}
						visible={dialog_message.visible}
						onDismiss={() => {
							set_dialog_message({ visible: false, actions: [], title: "", description: "" })
						}}
					>
						{dialog_message.icon ? <Dialog.Icon icon={dialog_message.icon} /> : null}
						<Dialog.Title className="">{dialog_message.title}</Dialog.Title>

						<Text className="text-left text-truncate" variant="bodyMedium">
							{dialog_message.description}
						</Text>
						<Dialog.Actions>
							{dialog_message?.actions?.map((action) => (
								<Button
									key={action.text}
									onPress={() => {
										set_dialog_message({ visible: false })
										action.clicked()
									}}
									icon={action.icon}
								>
									{action.text}
								</Button>
							))}
						</Dialog.Actions>
					</Dialog>
				</Portal>
				<List.Section title={Translated("settings")}>
					<List.Accordion title="Visuals" left={(props) => <List.Icon className="pl-5" icon="view-quilt" />}>
						<List.Item title={`Language: ${Translated("language_locale")}`} className="pl-10" left={(props) => <List.Icon icon="translate" />} onPress={async () => {}} />
						<List.Item disabled title = {`Theme: ${KentiminKarti.GET_THEME()}`} className="pl-10" left={(props) => <List.Icon icon="theme-light-dark" />}></List.Item>
					</List.Accordion>
				</List.Section>
			</Surface>
	)
}
