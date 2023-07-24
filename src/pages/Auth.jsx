import { useEffect, useState } from "react"
import { Button, Pressable, Text, TextInput, Touchable, TouchableHighlight, TouchableOpacity, View } from "react-native"

export default function LoginPage(props) {
	const [is_loading, set_is_loading] = useState(false)
	async function Login() {
		set_is_loading(true)
		setTimeout(() => {
			set_is_loading(false)
			props.navigation.navigate("Profile")
		}, 1000)
	}
	useEffect(() => {
		set_is_loading(false)
	}, [])
	const { name } = props
	return (<View className="absolute items-center gap-5 bg-accent w-screen h-screen mt-0 ml-0 dark:bg-primary-dark">
		<View className="">
			<Text className="text-primary mt-48 dark:text-white font-bold text-xl pb-1 pl-1">Username</Text>
			<TextInput id="input_username" className=" bg-accent dark:bg-accent-dark dark:text-white p-5 text-xl font-bold w-64 h-16 rounded-xl" />
		</View>
		<Pressable disabled={is_loading} className={"bg-accent dark:bg-accent-dark rounded-xl px-10 py-5 active:dark:bg-accent-light-dark active:scale-110" + (is_loading ? " bg-slate-700":"")} onPress={Login}>
			<Text className="text-primary dark:text-white text-xl font-bold">{is_loading ? "Loading..." : "Login"}</Text>
			</Pressable>
	</View>)
}