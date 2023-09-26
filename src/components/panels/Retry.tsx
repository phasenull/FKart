import { IconButton, Surface, Text } from "react-native-paper"
import React from "react"
export function Retry(props) {
	const {onPress} = props
	const {error} = props
	return (<Surface mode="flat" elevation={0} className="mx-auto my-auto">
		<Text className="self-center my-auto text-xl font-bold">{error || "Invalid Response From Server"}</Text>
		<IconButton
			className="self-center"
			size={48}
			icon={"refresh"}
			onPress={onPress}
		/>
	</Surface>)
}
