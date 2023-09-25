import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginPage from "./src/pages/Auth"
import { MD3DarkTheme, PaperProvider } from "react-native-paper"
const Stack = createNativeStackNavigator()
import { Home } from "./src/pages/Home"
import { DevPanel } from "./src/pages/DevPanel"
import { FCard } from "./src/network/FCard"
import { Appearance, PlatformColor, useColorScheme } from "react-native"
import { useMaterial3Theme, isDynamicThemeSupported } from "@pchmn/expo-material3-theme"
import { AppSettings } from "./src/pages/AppSettings"
import React from "react"
import Info from "./src/pages/Info"
export default function App() {
	const { theme } = useMaterial3Theme()
	const colorScheme = "dark" //useColorScheme()
	const ThemeContext = React.createContext(theme)
	FCard.__INIT__()
	const paperTheme = React.useMemo(
		() =>
			({ ...MD3DarkTheme, colors: MD3DarkTheme.dark }[(colorScheme, theme)]) //colorScheme === "light" ? { ...MD3LightTheme, colors: theme.light } : { ...MD3DarkTheme, colors: theme.dark }),
	)
	console.log(`App.js: Theme: ${theme} Dynamic: ${isDynamicThemeSupported}`)
	return (
		<PaperProvider theme={theme}>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Auth" component={LoginPage} options={{ headerShown: false }} />
					<Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
					<Stack.Screen name="DevPanel" component={DevPanel} options={{ headerShown: false }} />
					<Stack.Screen name="AppSettings" component={AppSettings} options={{ headerShown: false }} />
					<Stack.Screen name = "Info" component={Info} options={{ headerShown: true }} />
				</Stack.Navigator>
			</NavigationContainer>
		</PaperProvider>
	)
}
