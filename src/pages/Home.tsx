import { Image } from "react-native"
import { FKart } from "../network/FKart"
import React, { useState, Fragment, useEffect } from "react"
import { BottomNavigation, Portal, Surface, Text } from "react-native-paper"
import { PANEL_Account } from "../components/panels/Account"
import WebView from "react-native-webview"
import RouteCodeSelector from "../components/panels/RouteCodeSelector"

export function Home(props) {
	const { navigation } = props
	const [loading, set_loading] = useState(false)
	const [user, set_user] = useState(undefined)
	const [index, setIndex] = React.useState(3)
	async function get() {
		const data = await FKart.GetUser()
		console.log("USER", data?.username)
		if (!data || !data.token || !data.username) {
			console.log("not logged in, redirecting to Auth")
			navigation.replace("Auth")
			return
		}
		set_user(data)
	}
	useEffect(() => {
		get()
	}, [])
	const renderScene = BottomNavigation.SceneMap({
		routes: () => {
			return <RouteCodeSelector navigation={navigation} />
		},
		home: () => {
			return (
				<WebView
					navigation={navigation}
					style={{
						maxHeight: "100%",
						marginTop: 30,
					}}
					source={{ uri: "https://www.ulasimpark.com.tr/otobus/fiyat-tarifesi" }}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					startInLoadingState={true}
				/>
			)
		},
		map: () => {
			return <Image source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} className="w-screen justify-center top-5" />
		},
		account: () => {
			return <PANEL_Account navigation={navigation} />
		},
	})
	const routes = [
		{ key: "routes", title: "Routes", focusedIcon: "bus" },
		{ key: "home", title: "Home", focusedIcon: "home" },
		{ key: "map", title: "Map", focusedIcon: "map" },
		{ key: "account", title: "Account", focusedIcon: "account" },
	]
	return <BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} />
}
