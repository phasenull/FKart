import { NavigationContainer , DefaultTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
const Stack = createNativeStackNavigator()
import { AuthPage } from "./src/pages/Auth"
import { Home } from "./src/pages/Home"
import { DevPanel } from "./src/pages/DevPanel"
import { AppSettings } from "./src/pages/AppSettings"
import { AppRegistry } from "react-native"

import React from "react"
import Info from "./src/pages/Info"
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper"

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
import { FKart } from "./src/network/FKart"
import { useColorScheme } from "react-native"
import { useMaterial3Theme } from "@pchmn/expo-material3-theme"
export default function App(props) {
	const colorScheme = useColorScheme()
	const { theme, updateTheme, resetTheme } = useMaterial3Theme()

	const paperTheme = React.useMemo(
		() => (colorScheme === "dark" ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light }),
		[colorScheme, theme]
	)
	FKart.__INIT__()
	console.log(`App.js: Theme: ${colorScheme} ${paperTheme.colors.primary} `)
	console.log(paperTheme.colors)
	return (
		<PaperProvider theme={{...paperTheme}}>
			<NavigationContainer theme={paperTheme}>
				<Stack.Navigator initialRouteName="Home">
					<Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
					<Stack.Screen name="Auth" component={AuthPage} options={{ headerShown: false }} />
					<Stack.Screen name="DevPanel" options={{ headerShown: false }}>
						{() => <DevPanel updateTheme={updateTheme} />}
					</Stack.Screen>
					<Stack.Screen name="AppSettings" component={AppSettings} options={{ headerShown: false }} />
					<Stack.Screen name="Info" component={Info} options={{ headerShown: true }} />
				</Stack.Navigator>
			</NavigationContainer>
		</PaperProvider>
	)
}
AppRegistry.registerComponent("main", () => App)
