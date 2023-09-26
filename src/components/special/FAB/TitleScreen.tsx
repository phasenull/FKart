import { Button, Dialog, FAB, MD3LightTheme, Portal, Text } from "react-native-paper"
import { useState, Fragment } from "react"
import { LOGIN_AS_INCOGNITO, Translated } from "../../../util"
import { FKart } from "../../../network/FKart"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Settings } from "react-native/Libraries/Settings/Settings"
import React, { useEffect } from "react"
export function TitleScreenFAB(props) {
	const route = useRoute()
	const { navigation } = props
	const { initial_page } = props
	const [is_fab_group_open, set_is_fab_group_open] = useState(false)
	const [dialog_message, set_dialog_message] = useState(null)
	const [dialog_action, set_dialog_action] = useState({ ok: () => {} })
	const label_style = { fontSize: 14, right: -15 }
	const [enabled_buttons, set_enabled_buttons] = useState({ developer_settings: false })
	const [STATE_dialog, STATE_SET_dialog] = useState({
		visible: false,
		title: "INVALID TITLE",
		description: "INVALID DESCRIPTION",
		actions: [],
	})
	function toggleColorScheme() {
		navigation.replace(route.name, { initial_page: initial_page })
	}
	const [actions, set_actions] = useState([
		{
			icon: "bug",
			labelStyle: label_style,
			label: "Developer Settings",
			onPress: async () => {
				await FKart.SET_DATA("latest_page", "DeveloperSettings")
				navigation.push("DevPanel")
			},
			size: "medium",
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
			icon: "cog",
			labelStyle: label_style,
			label: Translated("settings"),
			onPress: async () => {
				await FKart.SET_DATA("latest_page", "AppSettings")
				navigation.push("AppSettings")
			},
			size: "medium",
		},
	])
	useEffect(() => {
		async function get() {
			const is_dev_mode_enabled = await FKart.GET_DATA("testing").then((data) => data?.is_dev_settings_enabled)
			console.log("is_dev_mode_enabled", is_dev_mode_enabled)
			if (is_dev_mode_enabled) {
				set_enabled_buttons({
					...enabled_buttons,
					developer_settings: true,
				})
			}
		}
		get()
	}, [])

	function SET_HELP({
		title = "Information",
		description = "INVALID DESCRIPTION",
		actions = [],
		visible = true,
	}: {
		title: string
		description: string
		actions: object[]
		visible: boolean
	}) {
		STATE_SET_dialog({ title: title, description: description, actions: actions, visible: visible })
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
					visible={STATE_dialog.visible}
					onDismiss={() => {
						STATE_SET_dialog({ visible: false, actions: [], title: "", description: "" })
					}}
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
										STATE_SET_dialog({ visible: false, actions: [], title: "", description: "" })
										action.action()
									}}
								>
									{action.text}
								</Button>
							)
						})}
					</Dialog.Actions>
				</Dialog>
			</Portal>
			<FAB.Group
				{...props}
				visible
				open={is_fab_group_open}
				icon={is_fab_group_open ? "menu-down" : "menu"}
				actions={enabled_buttons.developer_settings ? actions : actions.filter((action) => action.icon !== "bug")}
				onStateChange={({ open }) => set_is_fab_group_open(open)}
			></FAB.Group>
		</Fragment>
	)
}
