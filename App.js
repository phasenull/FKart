import * as React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginPage from "./src/pages/Auth"
import { useColorScheme } from "nativewind"
import { MD3DarkTheme, MD3LightTheme, PaperProvider, useTheme } from "react-native-paper"
const Stack = createNativeStackNavigator()
import { useState, useEffect } from "react"
export default function App() {
	const [theme, setTheme] = useState("light")
	useEffect(() => {
		// Update the document title using the browser API
		console.log("theme:", theme)
	}, [theme])
	const theme_provider = theme === "dark" ? MD3DarkTheme : MD3LightTheme
	console.log("theme:", theme)
	return (
		<PaperProvider theme={theme_provider}>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Auth" component={LoginPage} options={{ headerShown: false }} />
					<Stack.Screen name="Profile" component={LoginPage} options={{ headerShown: false }} />
				</Stack.Navigator>
			</NavigationContainer>
		</PaperProvider>
	)
}