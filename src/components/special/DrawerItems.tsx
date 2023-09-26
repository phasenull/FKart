import React from "react"
import { Switch, Text, View } from "react-native"
import { TouchableRipple } from "react-native-paper"
export function DrawerItems(props) {
	return (
		<React.Fragment>
			<TouchableRipple >
				<View>
					<Text >RTL</Text>
					<View pointerEvents="none">
						<Switch />
					</View>
				</View>
			</TouchableRipple>
		</React.Fragment>
	)
}
