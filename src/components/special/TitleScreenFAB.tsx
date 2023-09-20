import { Button, Dialog, FAB, MD3LightTheme, Portal, Text } from "react-native-paper"
import { useState,Fragment  } from "react"
import { LOGIN_AS_INCOGNITO, Translated } from "../../util"
import { KentiminKarti } from "../../network/KentiminKarti"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Settings } from "react-native/Libraries/Settings/Settings"
import React from "react"
export function TitleScreenFAB(props) {
	const route = useRoute()
	const { navigation } = props
	const {initial_page} = props
	const [is_fab_group_open, set_is_fab_group_open] = useState(false)
	const [dialog_message, set_dialog_message] = useState(null)
	const [dialog_action, set_dialog_action] = useState({"ok":() => {}})
	const label_style = { fontSize: 14, right: -15 }
	const [STATE_dialog, STATE_SET_dialog] = useState({
		visible: false,
		title: "INVALID TITLE",
		description: "INVALID DESCRIPTION",
		actions: [],
	})
	function toggleColorScheme() {
		navigation.replace(route.name,{initial_page:initial_page})
	}
	function SET_HELP({ title="Information",description="INVALID DESCRIPTION", actions=[], visible = true}:{title:string,description:string,actions:object[], visible:boolean}) {
		STATE_SET_dialog({ title:title, description:description, actions:actions, visible:visible })
	}
	return (
		<Fragment>
			<Portal>
				<Dialog
					visible={dialog_message}
					onDismiss={() => {
						set_dialog_message(null)
					}}
				>
					<Dialog.Title className="">{Translated("info")}:</Dialog.Title>
					<Dialog.Content>
						<Text variant="bodyMedium">{dialog_message}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button
							onPress={() => {
								set_dialog_message(null)
								dialog_action.ok()
							}}
						>
							{Translated("ok")}
						</Button>
					</Dialog.Actions>
				</Dialog>
				<Dialog
					visible = {STATE_dialog.visible}
					onDismiss={() => {
						STATE_SET_dialog({visible:false,actions:[],title:"",description:""})
					}
					}
				>
					<Dialog.Title className="">{STATE_dialog.title}</Dialog.Title>
					<Dialog.Content>
						<Text variant="bodyMedium">{STATE_dialog.description}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						{STATE_dialog.actions.map((action) => {
							return (
								<Button

									onPress={() => {
										STATE_SET_dialog({visible:false,actions:[],title:"",description:""})
										action.action()
									}
									}
								>
									{action.text}
								</Button>
							)
						}
						)}
					</Dialog.Actions>
				</Dialog>
			</Portal>
			<FAB.Group
				visible
				open={is_fab_group_open}
				icon={is_fab_group_open ? "menu-down" : "menu"}
				actions={[
					{
						icon: "cog",
						labelStyle: label_style,
						label: Translated("settings"),
						onPress: async () => {
							navigation.push("AppSettings")
							await KentiminKarti.SET_DATA("latest_page","AppSettings")
							// const current_lang = KentiminKarti.GET_SETTINGS().language
							// const languages = KentiminKarti.GET_AVAILABLE_LANGUAGES()
							// let next_lang : number | string = (languages.indexOf(current_lang) + 1)
							// if (next_lang >= languages.length) {
							// 	next_lang = 0
							// }
							// next_lang = languages[next_lang]
							// console.log("next_lang", next_lang)
							// KentiminKarti.SET_SETTING("language", next_lang)
							// set_dialog_action({"ok": () => {
							// 	console.log("Page",route.name)
							// 	navigation.replace(route.name,{initial_page:initial_page})
							// }})
							// set_dialog_message(`Language changed to ${Translated("language_locale")} (${next_lang})`)
						},
						size: "medium",
					},
					{
						icon: "theme-light-dark",
						size: "medium",
						label: "Theme",
						labelStyle: label_style,
						onPress: async () => {
							await toggleColorScheme()
						},
					},
					{
						icon: "incognito",
						size: "medium",
						labelStyle: label_style,
						label: "Incognito Account",
						onPress: async () => {
							await LOGIN_AS_INCOGNITO()
							navigation.replace("Home")
						},
					},
					{
						icon: "tools",
						size: "medium",
						labelStyle: label_style,
						label: "Developer Settings",
						onPress: async () => {
							navigation.push("DevPanel")
							await KentiminKarti.SET_DATA("latest_page","DevPanel")
						},
					}
				]}
				onStateChange={({ open }) => set_is_fab_group_open(open)}
			></FAB.Group>
		</Fragment>
	)
}
