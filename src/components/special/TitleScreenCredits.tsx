import { Fragment, useState } from "react"
import { Linking } from "react-native"
import { Button, Portal, Snackbar, Text } from "react-native-paper"
import React from "react"
export function TitleScreenCredits(props) {
	const [STATE_snackbar, STATE_SET_snackbar] = useState(false)
	function credits() {
		Linking.openURL("https://instagram.com/arif.visuals")
	}
	return (
		<Fragment>
			<Button
				mode="text"
				icon={"instagram"}
				{...props}
				textColor="white"
				onPress={credits}
				onLongPress={() => {
					STATE_SET_snackbar(true)
					// todo: fix this
					// Clipboard.setString("https://instagram.com/arif.visuals")
				}}>
				<Text className="text-white font-bold">Shot by @</Text>
				arif.visuals
			</Button>
			<Portal>
				<Snackbar
					className="flex"
					duration={2000}
					visible={STATE_snackbar}
					onDismiss={() => {
						STATE_SET_snackbar(false)
					}}
				>
					Copied to clipboard!
				</Snackbar>
			</Portal>
		</Fragment>
	)
}
