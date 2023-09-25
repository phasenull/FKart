import { View, Platform, StatusBar } from "react-native"
import { FCard } from "../network/FCard"
import React, { useState, Fragment, useEffect } from "react"
import { BottomNavigation, Drawer, Portal, Surface, Text } from "react-native-paper"
import { PANEL_Account } from "../components/panels/Account"
import WebView from "react-native-webview"
import RouteCodeSelector from "../components/panels/RouteCodeSelector"

function vewviewfunc() {
	return (
		<WebView
			style={{
				maxHeight: "100%",
				marginTop: 30,
			}}
			source={{ uri: "https://m.kentkart.com" }}
			javaScriptEnabled={true}
			domStorageEnabled={true}
			startInLoadingState={true}
		></WebView>
	)
}
export function Home(props) {
	const { navigation } = props
	const [loading, set_loading] = useState(false)
	const app = FCard
	const user = app.GetUser()
	const [index, setIndex] = React.useState(0)
	const renderScene = BottomNavigation.SceneMap({
		routes: ()=><RouteCodeSelector navigation={navigation}/>,
		home: vewviewfunc,
		account: PANEL_Account,
	})
	const routes = [
		{ key: "routes", title: "Routes", focusedIcon: "bus" },
		{ key: "home", title: "Home", focusedIcon: "home" },
		{ key: "account", title: "Account", focusedIcon: "account" },
	]
	if (!user) {
		navigation.replace("Auth")
	}
	return user ? (
		<BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} />
	) : (
		<View className="mx-auto my-auto">
			<Text className="text-xl">Not logged in, redirecting to Log In page</Text>
		</View>
	)
}
