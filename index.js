import App from "./App"
import { AppRegistry } from "react-native"
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper"

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
import { FKart } from "./src/network/FKart"
import { useColorScheme } from "react-native"
import { useMaterial3Theme } from "@pchmn/expo-material3-theme"
import React from "react"
function main(params) {
	const colorScheme = useColorScheme()
	const { theme,updateTheme, resetTheme } = useMaterial3Theme()

	const paperTheme = React.useMemo(
		() => (colorScheme === "dark" ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light }),
		[colorScheme, theme]
	)
	FKart.__INIT__()
	console.log(`App.js: Theme: ${colorScheme} ${paperTheme.colors.primary} `)
	return (
		<PaperProvider theme={paperTheme}>
			<App updateTheme = {updateTheme}/>
		</PaperProvider>
	)
}
AppRegistry.registerComponent("main", () => main)
