import App from "./App"
import { AppRegistry } from "react-native"
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper"

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
import { FKart } from "./src/network/FKart"
import { useColorScheme } from "react-native"
function main(params) {
	const theme = useColorScheme()
	FKart.__INIT__()
	console.log(`App.js: Theme: ${theme} `)
	return (
		<PaperProvider theme={theme == "dark" ? MD3DarkTheme : MD3LightTheme}>
			<App />
		</PaperProvider>
	)
}
AppRegistry.registerComponent("main", () => main)
