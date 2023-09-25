import { useState, useEffect } from "react"
import { Image } from "react-native"
import { Button, Card, Surface, Text } from "react-native-paper"
import { Translated, get_app_name } from "../util"
import { TitleScreenFAB } from "../components/special/FAB/TitleScreen"
import { TitleScreenCredits } from "../components/special/TitleScreenCredits"
import { FCard } from "../network/FCard"
import React from "react"
import Panel_Auth from "../components/panels/AuthPanel"
import { useColorScheme } from "react-native"
export default function LoginPage(props) {
	const { navigation } = props
	let initial_page = props.route.params?.initial_page
	const [language,set_language] = useState(FCard.GET_DATA("language"))
	const [user,set_user] = useState({username:"anonymous",id:"-1",token:""})
	useEffect(() => {
		async function get() {
			const logged_in_user = await FCard.GetUser()
			if (!logged_in_user) return
			set_user(logged_in_user)
			console.log("LOGGED_IN_USER", JSON.stringify(logged_in_user))
			const language = await FCard.GET_DATA("language")
			set_language(language)
		}
		get()
	}, [])
	

	if (!(initial_page == "Sign Up" || initial_page == "Log In")) {
		initial_page = "Log In"
	}
	const [page, set_page] = useState(initial_page)
	function move_to_page() {
		if (user.token) {
			navigation.navigate("Home")
		}
	}
	useEffect(() => {
		move_to_page()
	}, [user])
	const { name } = props
	return (
		<React.Fragment>
			<Surface className="px-5 items-center bg-secondary w-screen h-full mt-0 justify-center ml-0 dark:bg-primary-dark">
				{/* TITLE & IMAGE */}
				<Image source={require("../assets/media/tramvay.png")} className="absolute h-96 w-screen justify-center top-5" />
				<Text className="text-5xl absolute top-20 font-bold text-center text-white">{get_app_name()}</Text>

				{/* CREDITS */}
				<TitleScreenCredits />

				{/* 
				LOG IN / SIGN UP FORM LOADER
			*/}
				<Card className="relative rounded-2xl w-full h-max top-10 p-5" mode="elevated">
					<Text className="font-bold text-xl mb-5 text-center w-max">{page == "Log In" ? Translated("login") : Translated("signup")}</Text>
					<Panel_Auth page_type={page} move_to_page={move_to_page} navigation={navigation} />
				</Card>
				{/* 
				CHANGE PAGE BUTTON
			*/}
				<Button
					className="relative top-16"
					mode="elevated"
					onPress={() => {
						if (page == "Log In") {
							set_page("Sign Up")
						} else {
							set_page("Log In")
						}
					}}
				>
					{page == "Log In" ? Translated("signup_instead").split("/*")[0] : Translated("login_instead").split("/*")[0]}
					<Text className="text-blue-400">
						{page == "Log In" ? Translated(Translated("signup_instead").split("/*")[1]) : Translated(Translated("login_instead").split("/*")[1])}
					</Text>
					{page == "Log In" ? Translated("signup_instead").split("/*")[2] : Translated("login_instead").split("/*")[2]}
				</Button>
				<TitleScreenFAB navigation={navigation} initial_page={page} />
			</Surface>

			<Text className="text-slate-500 opacity-50 sticky mx-auto w-full bottom-5 font-bold text-center">
				{require("../../package.json").version} | {useColorScheme() || "?"}
			</Text>
		</React.Fragment>
	)
}
