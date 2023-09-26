import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
const Stack = createNativeStackNavigator()
import { AuthPage } from "./src/pages/Auth"
import { Home } from "./src/pages/Home"
import { DevPanel } from "./src/pages/DevPanel"
import { AppSettings } from "./src/pages/AppSettings"
import React from "react"
import Info from "./src/pages/Info"
export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
				<Stack.Screen name="Auth" component={AuthPage} options={{ headerShown: false }} />
				<Stack.Screen name="DevPanel" component={DevPanel} options={{ headerShown: false }} />
				<Stack.Screen name="AppSettings" component={AppSettings} options={{ headerShown: false }} />
				<Stack.Screen name="Info" component={Info} options={{ headerShown: true }} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}
