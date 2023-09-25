import { useState } from "react"
import { Button, Dialog, List, Portal, Surface, Text } from "react-native-paper"
import { FCard } from "../network/FCard"
import { Translated } from "../util"
import React, {useEffect} from "react"
import { LanguageModal } from "../components/special/LanguageModal"
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
	const [enabled_buttons, set_enabled_buttons] = useState({ developer_settings: false })
	useEffect(() => {
		async function get() {
			const is_dev_mode_enabled = await FCard.GET_DATA("testing").then((data) => data?.is_dev_settings_enabled)

			if (is_dev_mode_enabled) {
				set_enabled_buttons({
					...enabled_buttons,
					developer_settings: true,
				})
			}
		}
		get()
	}, [])
	const { navigation } = props
	const [language_selector, set_language_selector] = useState(false)
	const [loading, set_loading] = useState(false)
	const [dialog_message, set_dialog_message] = useState(state)
	return (
		<Surface className="mx-auto w-[80%] my-auto p-5 rounded-xl">
			<Portal>
				<React.Fragment>
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
					{language_selector ? (
						<LanguageModal navigation={navigation}
							onLeave={() => {
								set_language_selector(false)
							}}
						/>
					) : null}
				</React.Fragment>
			</Portal>
			<List.Section title={Translated("settings")}>
				<List.Accordion title="Visuals" left={(props) => <List.Icon className="pl-5" icon="view-quilt" />}>
					<List.Item
						title={`Language: ${Translated("language_locale")}`}
						className="pl-10"
						left={(props) => <List.Icon icon="translate" />}
						onPress={() => {
							set_language_selector(true)
						}}
					/>
					<List.Item disabled title={`Theme: ${FCard.GET_THEME()}`} className="pl-10" left={(props) => <List.Icon icon="theme-light-dark" />}></List.Item>
				</List.Accordion>
				<List.Accordion title="Danger Zone" left={(props) => <List.Icon className="pl-5" icon="alert" />}>
					<List.Item
						title={`Dev Menu: ${enabled_buttons.developer_settings ? "Enabled" : "Disabled"}`}
						className="pl-10"
						left={(props) => <List.Icon icon="tools" />}
						onPress={async () => {
							FCard.SET_DATA("testing", {
								...await FCard.GET_DATA("testing"),
								is_dev_settings_enabled: !enabled_buttons.developer_settings,
							} )
							set_enabled_buttons({
								...enabled_buttons,
								developer_settings: !enabled_buttons.developer_settings,
							})
						}}
					/>
				</List.Accordion>
			</List.Section>
		</Surface>
	)
}
