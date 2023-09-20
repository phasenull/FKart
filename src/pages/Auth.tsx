import { useState, useEffect } from "react"
import { Image} from "react-native"
import { Button, Card, Surface, Text } from "react-native-paper"
import { Translated, get_app_name } from "../util"
import { TitleScreenFAB } from "../components/special/TitleScreenFAB"
import { TitleScreenCredits } from "../components/special/TitleScreenCredits"
import { KentiminKarti } from "../network/KentiminKarti"
import React from "react"
import Panel_Auth from "../components/panels/AuthPanel"
import { useColorScheme } from "react-native"
export default function LoginPage(props) {
	const { navigation } = props
	let initial_page = props.route.params?.initial_page
	const language = KentiminKarti.GET_SETTINGS().language
	if (!(initial_page == "Sign Up" || initial_page == "Log In")) {
		initial_page = "Log In"
	}
	const db = KentiminKarti.DB()
	const [page, set_page] = useState(initial_page)
	async function move_to_page() {
		return
		// if (!(page == "Log In")) {return}
		// const latest_page = await KentiminKarti.GET_DATA("latest_page")
		// if (latest_page) {
		// 	if (latest_page.push_to_top) {
		// 		navigation.push(latest_page)
		// 	} else {
		// 		navigation.push(latest_page)
		// 	}
		// }
	}
	useEffect(() => {
		console.log("page", page)
		move_to_page()
	}, [page])
	const { name } = props
	return (
		<Surface className="absolute px-5 gap-y-5 items-center bg-secondary w-screen h-full mt-0 justify-center ml-0 dark:bg-primary-dark">
			{/* TITLE & IMAGE */}
			{language && true}
			<Image source={require("../assets/media/tramvay.png")} className="absolute h-96 w-screen justify-center -top-5" />
			<Text className="text-5xl absolute top-20 font-bold text-center text-white">{get_app_name()} {require("../../package.json").version}</Text>

			{/* CREDITS */}
			<TitleScreenCredits />

			{/* 
				LOG IN / SIGN UP FORM LOADER
			*/}
			<Card className="rounded-2xl w-full h-max p-5" mode="elevated">
				<Text className="font-bold text-xl mb-5 text-center w-max">{page == "Log In" ? Translated("login") : Translated("signup")} {useColorScheme() || "?"}</Text>
				<Panel_Auth page_type={page} navigation={navigation} />
			</Card>
			{/* 
				CHANGE PAGE BUTTON
			*/}
			<Button
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
	)
}
