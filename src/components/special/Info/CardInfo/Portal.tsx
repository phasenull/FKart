import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper"

import React from "react"
import Card from "../../../../network/Card"
export function CardInfoPortal(props) {
	const [form_data, set_form_data] = React.useState({ value: "" })
	const { data } = props
	const { setVisible } = props
	const { get } = props
	function rename_pressed() {
		const card = data
		card.Rename({ new_description: form_data.value, alias: card.alias })
		setVisible(false)
		get()
	}
	return (
		<Portal>
			{/* RENAME ACTION DIALOG */}
			<Dialog {...props} visible={true} onDismiss={props.onDissmiss || (() => {})}>
				<Dialog.Title>Yeni isim girin</Dialog.Title>
				<Dialog.Content>
					<Text className="text-[18px] font-bold self-center mb-3">
						"{data.description}" <Text className="text-[16px]">için yeni isim girin:</Text>
					</Text>
					<TextInput
						className="w-64 self-center"
						defaultValue={data.description}
						placeholder="My New Card"
						onChangeText={(text) => {
							set_form_data({ ...form_data, value: text })
						}}
					/>
				</Dialog.Content>
				<Dialog.Actions>
					<Button
						onPress={() => {
							setVisible(false)
						}}
					>
						Cancel
					</Button>
					<Button onPress={rename_pressed}>Confirm</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	)
}
