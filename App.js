import * as React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginPage from "./src/pages/Auth"
const Stack = createNativeStackNavigator()
export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Login" component={LoginPage} options={{ headerShown:false}} />
				<Stack.Screen name="Register" component={LoginPage} options={{ headerShown:false}} />
				<Stack.Screen name="Profile" component={LoginPage} options={{ headerShown:false}}/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}
