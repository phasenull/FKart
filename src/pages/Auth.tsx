import { useState, useEffect } from "react"
import { Image, View } from "react-native"
import { Button, Card, Surface, Text } from "react-native-paper"
import { Translated, get_app_name } from "../util"
import { TitleScreenFAB } from "../components/special/FAB/TitleScreen"
import { TitleScreenCredits } from "../components/special/TitleScreenCredits"
import { FKart } from "../network/FKart"
import React from "react"
import Panel_Auth from "../components/panels/AuthPanel"
import { useColorScheme } from "react-native"
export function AuthPage(props) {
	const { navigation } = props
	let initial_page = props.route.params?.initial_page
	const params = props.route.params
	const [language, set_language] = useState(FKart.GET_DATA("language"))
	const [user, set_user] = useState({ username: "anonymous", id: "-1", token: "" })
	useEffect(() => {
		async function get() {
			const logged_in_user = await FKart.GetUser()
			if (!logged_in_user) return
			set_user(logged_in_user)
			const language = await FKart.GET_DATA("language")
			set_language(language)
		}
		get()
	}, [])

	if (!(initial_page == "Sign Up" || initial_page == "Log In")) {
		initial_page = "Log In"
	}
	const [page, set_page] = useState(initial_page)
	function move_to_page() {
		if (user.token && !params?.lock_move) {
			navigation.navigate("Home")
		}
	}
	// useEffect(() => {
	// 	move_to_page()
	// }, [user])
	const { name } = props
	return (
		<Surface className="h-full w-full" mode="flat" elevation={1}>
			{/* TITLE & IMAGE */}
			<Image source={require("../assets/media/tramvay.png")} className="absolute h-96 w-screen justify-center" />
			<Text className="text-5xl absolute top-20 font-bold text-center self-center text-white">{get_app_name()}</Text>

			{/* CREDITS */}
			<TitleScreenCredits className="self-center top-40" />

			{/* 
				LOG IN / SIGN UP FORM LOADER
			*/}
			<Card className="rounded-2xl w-[90%] self-center h-max top-48 p-5" mode="elevated">
				<Text className="font-bold text-xl mb-5 text-center w-max">{page == "Log In" ? Translated("login") : Translated("signup")}</Text>
				<Panel_Auth page_type={page} move_to_page={move_to_page} navigation={navigation} />
				<Button
					className="w-max absolute -bottom-20 h-max self-center"
					mode="contained-tonal"
					onPress={() => {
						if (page == "Log In") {
							set_page("Sign Up")
						} else {
							set_page("Log In")
						}
					}}
				>
					{page == "Log In" ? FKart.TranslationFile().signup_instead : FKart.TranslationFile().login_instead}
				</Button>
			</Card>
			{/* 
				CHANGE PAGE BUTTON
			*/}
			<Text className="absolute bottom-5 self-center text-slate-500 opacity-50 mx-auto font-bold text-center">
				{require("../../package.json").version} | {useColorScheme() || "?"}
			</Text>
			<TitleScreenFAB navigation={navigation} initial_page={page} />
		</Surface>
	)
}
