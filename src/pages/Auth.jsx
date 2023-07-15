import { Text, TextInput, View } from "react-native"


export default function LoginPage(props) {
	const { name } = props
	return (<View className="absolute items-center gap-5 bg-accent w-screen h-screen mt-0 ml-0 dark:bg-primary-dark">
		<View className="">
			<Text className="text-primary mt-48 dark:text-white font-bold text-xl pb-1 pl-1">Username</Text>
			<TextInput id="input_username" className="border bg-accent dark:bg-accent-dark dark:text-white p-5 text-xl font-bold w-64 h-16 rounded-xl" />
		</View>
	</View>)
}