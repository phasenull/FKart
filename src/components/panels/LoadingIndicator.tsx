import { ActivityIndicator, Portal, ProgressBar, Surface, Text } from "react-native-paper"
import React from "react"
export function LoadingIndicator(props) {
	const { loading } = props
	return (
		// <Portal>
		<Surface elevation={0} mode="flat" className="mx-auto w-full p-5 my-auto">
			<Text className="font-bold mx-auto my-5 text-xl">Loading...</Text>
			<ActivityIndicator size={"large"} />
		</Surface>
		// </Portal>
	)
}
