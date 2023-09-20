import { View } from "react-native"
import { KentiminKarti } from "../network/KentiminKarti"
import React, { useState, Fragment } from "react"
import { BottomNavigation, Drawer, Portal, Surface, Text } from "react-native-paper"
import { PANEL_Account } from "../components/panels/Account"
import WebView from "react-native-webview"

export function Home(props) {
	const { navigation } = props
	const [loading, set_loading] = useState(false)
	const app = KentiminKarti
	const user = app.GetUser()
	const [page, set_page] = useState(0)
	const pages = [
		<WebView
			style={{
				maxHeight: "100%",
				marginTop: 30,
			}}
			source={{ uri: "https://m.kentkart.com"}}
			javaScriptEnabled={true}
			domStorageEnabled={true}
			startInLoadingState={true}
		></WebView>,
		null,
		<PANEL_Account navigation={navigation} />,
	]
	if (!user) {
		navigation.replace("Auth")
	}
	return (
		(user && (
			<View>
				<Surface mode="flat" className="w-screen h-screen" elevation={0}>
					{pages[page] || (
						<Text variant="displayMedium" className="font-bold mx-auto my-auto">
							Page not found
						</Text>
					)}
				</Surface>

				<Portal>
					<BottomNavigation.Bar
						style={{ position: "absolute", bottom: 0 }}
						shifting={true}
						onTabPress={(e) => {
							set_page(e.route.index)
						}}
						navigationState={{
							index: page,
							routes: [
								{ key: "home", title: "Home", focusedIcon: "home", unfocusedIcon: "home-outline", index: 0 },
								{ key: "favorites", title: "Favorites", focusedIcon: "star", unfocusedIcon: "star-outline", index: 1 },
								{ key: "account", title: "Account", focusedIcon: "account", unfocusedIcon: "account-outline", index: 2 },
							],
						}}
					/>
				</Portal>
			</View>
		)) || (
			<View className="mx-auto my-auto">
				<Text className="text-xl">Not logged in, redirecting to Log In page</Text>
			</View>
		)
	)
}
