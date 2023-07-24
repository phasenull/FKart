import { useContext, useEffect, useMemo, useState } from "react"
import { Image, Pressable, View } from "react-native"
import { Button, Card, Dialog, FAB, IconButton, Portal, Surface, Text, useTheme } from "react-native-paper"
import { TextInput } from "react-native-paper"
import Panel_SignUp from "../components/panels/SignUp"
import Panel_LogIn from "../components/panels/LogIn"
import { useNavigation } from "@react-navigation/native"
import { Translated, get_app_name } from "../util"
export default function LoginPage(props) {
	const { navigation } = props
	const { initial_page } = { ...props.route.params }
	const [is_loading, set_is_loading] = useState(false)
	const [is_fab_group_open, set_is_fab_group_open] = useState(false)
	const [dialog_message, set_dialog_message] = useState(null)
	console.log("initial_page", initial_page)
	const [page, set_page] = useState(initial_page || "Log In")

	const [theme, set_theme] = useState("light")
	function toggleColorScheme() {
		set_theme(theme == "light" ? "dark" : "light")
	}
	useEffect(() => {
		console.log("colorSchemee", theme)
		// const scheme = nativeColorScheme(colorScheme == "dark" ? MD3DarkTheme : MD3LightTheme)
	}, [theme])
	const { name } = props
	return (
		<View className="absolute px-5 items-center gap-y-5 bg-secondary w-screen h-full mt-0 justify-center ml-0 dark:bg-primary-dark">
			<Image source={require("../assets/media/kocaeli.png")} className="absolute w-screen justify-center -top-5" />
			<Text>
				DEBUG: theme-{theme}
			</Text>
			<Text className="text-5xl bottom-20 font-bold text-center text-white">
				{get_app_name()}
			</Text>
			<Card className="rounded-2xl w-full h-max p-5" mode="elevated">
				<Text className="font-bold text-xl mb-5 text-center w-max">{page == "Log In" ? Translated("login") : Translated("signup")}</Text>
				{page == "Sign Up" ? <Panel_SignUp /> : <Panel_LogIn />}
			</Card>
			<Portal>
				<Dialog visible={dialog_message} onDismiss={() => { set_dialog_message(null) }}>
					<Dialog.Title className="">{Translated("info")}:</Dialog.Title>
					<Dialog.Content>
						<Text variant="bodyMedium">{dialog_message}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => { set_dialog_message(null) }}>{Translated("ok")}</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
			<Button
				mode="elevated"
				onPress={
					async () => {
						if (page == "Log In") {
							await navigation.push("Auth", { initial_page: "Sign Up" })
						}
						else {
							navigation.goBack({ initial_page: "Log In" })
						}
					}
				}>
				{page == "Log In" ? Translated("signup_instead").split("/*")[0] : Translated("login_instead").split("/*")[0]}
				<Text className="text-blue-400">
					{page == "Log In" ? Translated(Translated("signup_instead").split("/*")[1]) : Translated(Translated("login_instead").split("/*")[1])}
				</Text>
				{page == "Log In" ? Translated("signup_instead").split("/*")[2] : Translated("login_instead").split("/*")[2]}
			</Button>
			<FAB.Group
				className="absolute right-0 bottom-0 m-2"
				open={is_fab_group_open}
				visible
				icon={is_fab_group_open ? "menu-down" : "menu"}
				actions={[
					{
						icon: "earth", onPress: () => {
							console.log("Pressed languages")
							set_dialog_message("This feature is not implemented yet")
						},
						size: "medium"
					},
					{ icon: "theme-light-dark", size:"medium", onPress: () => { toggleColorScheme() } }
				]}
				onStateChange={({ open }) => set_is_fab_group_open(open)}
			>
			</FAB.Group>
			{/* <IconButton icon="theme-light-dark" mode="contained" size={40} className="absolute right-0 bottom-0 m-3"
				onPress={toggleColorScheme}>
			</IconButton> */}
		</View>)
}