import { Image } from "react-native"
import { FKart } from "../network/FKart"
import React, { useState, Fragment, useEffect } from "react"
import { BottomNavigation, Portal, Surface, Text } from "react-native-paper"
import { PANEL_Account } from "../components/panels/Account"
import WebView from "react-native-webview"
import RouteCodeSelector from "../components/panels/RouteCodeSelector"
import { Translated } from "../util"
import { PANEL_Map } from "../components/panels/Map"

import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"
function HomeFunc(props) {
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
	const renderScene = React.useMemo(
		()=>BottomNavigation.SceneMap({
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
				return <PANEL_Map navigation={navigation} />
			},
			account: () => {
				return <PANEL_Account navigation={navigation} />
			},
		}),
		[]
	)
	const routes = [
		{ key: "routes", title: Translated("routes"), focusedIcon: "bus" },
		{ key: "home", title: Translated("home"), focusedIcon: "home" },
		{ key: "map", title: Translated("Map"), focusedIcon: "map" },
		{ key: "account", title: Translated("Account"), focusedIcon: "account" },
	]
	const insets = useSafeAreaInsets()
	return (
		<SafeAreaProvider>
			<BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} />
		</SafeAreaProvider>
	)
}
export const Home = HomeFunc