import { Fragment as Fragment, useState } from "react"
import { Button, Dialog, List, Portal, Surface, Text, TextInput } from "react-native-paper"
import { FCard } from "../network/FCard"
import { Translated } from "../util"
import React from "react"
import { LoadingIndicator } from "../components/panels/LoadingIndıcator"
interface DialogState {
	visible: boolean
	title?: string
	description?: string
	actions?: { clicked: Function; text: string; icon?: string; disabled?: boolean }[]
	icon?: string
}

export function DevPanel(props) {
	const state: DialogState = {
		visible: false,
		title: "INVALID TITLE",
		description: "INVALID DESCRIPTION",
		actions: [],
		icon: null,
	}
	const [data, set_data] = useState({ card_no: undefined })
	const [loading, set_loading] = useState(false)
	const [dialog_message, set_dialog_message] = useState(state)
	React.useEffect(() => {
		async function getData() {
			return true
			const data = await FCard.GET_DATA("testing")
			set_data(data)
			set_inputs({ ...inputs, card_no: data.card_no })
		}
		getData()
	}, [])
	async function getBalance() {
		{
			set_loading(true)
			const alias = remove_dashes_from_string(inputs.card_no) || ""
			// public api key
			//todo: change this to a private api key
			const url = `https://service.kentkart.com/rl1/api/card/balance?region=004&lang=tr&authType=3&token=${undefined}&alias=${alias}`
			const response = await fetch(url)
			const json = await response.json()
			if (!json) {
				return set_dialog_message({
					visible: true,
					title: "Error-???",
					description: `Unknown Error (No Response)`,
					actions: [{ clicked: () => {}, text: "Ok" }],
					icon: "alert",
				})
			}
			const error_message_details = {
				3: "invalid_card_no",
				34: "card_no_is_empty",
			}
			set_loading(false)
			if (json.error || !json.cardlist) {
				return set_dialog_message({
					visible: true,
					title: `Error-${json.result?.code}`,
					description: `
					Sunucudan Gelen Yanıt: "Error ${json.result?.code} : ${json.result?.message || "Unknown Error"}"

					Açıklama: ${Translated(error_message_details[json.result?.code] || "Unknown Error")}
					`,
					actions: [
						{
							clicked: () => {
								set_dialog_message({ visible: false })
							},
							text: "Ok",
						},
					],
					icon: "alert",
				})
			}
			const card = json.cardlist[0]
			if (!card) {
				return set_dialog_message({
					visible: true,
					title: "Balance",
					description: `INVALID CARD ${JSON.stringify(json)}`,
					actions: [
						{
							clicked: () => {
								set_dialog_message({ visible: false })
							},
							text: "Ok",
						},
					],
					icon: "credit-card-remove-outline",
				})
			}
			const r_date = json.result?.dateTime || "00000000000000"
			const date = {
				year: r_date?.substring(0, 4),
				month: r_date?.substring(4, 6),
				day: r_date?.substring(6, 8),
				hour: r_date?.substring(8, 10),
				minute: r_date?.substring(10, 12),
				second: r_date?.substring(12, 14),
			}
			set_dialog_message({
				visible: true,
				title: "Balance",
				description: `
				Balance: ${card.balance} TL
				
				Last Usage: ${card.usage[0].amt || "N/A"} TL (${card.usage[0].date || "N/A"})
				Last Load: ${card.usage[1].amt || "N/A"} TL (${card.usage[1].date || "N/A"})

				Server Time: ${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute}:${date.second}
				`,
				actions: [
					{
						clicked: async () => {
							await FCard.SET_DATA("testing", { card_no: alias })
						},
						icon: "content-save",
						text: "Save Card No",
					},
					{
						clicked: async () => {
							set_dialog_message({ visible: false, actions: [] })
							await getBalance()
						},
						icon: "cached",
						text: "Refresh",
					},
					{
						clicked: () => {
							set_dialog_message({ visible: false })
						},
						text: "Ok",
					},
				],
				icon: null,
			})
		}
	}
	const data_card = FCard.GET_DATA("testing")
	const [inputs, set_inputs] = useState({
		card_no: data.card_no,
	})
	function remove_dashes_from_string(string:string) {
		return string.replace(/-/g, "")
	}
	return (
		<Fragment>
			<Text className="text-center text-2xl font-bold">Developer Panel</Text>
			<Surface className="mx-auto w-[80%] my-auto p-5 rounded-xl">
				<Portal>
					{loading ? (<LoadingIndicator />) : null}
					<Dialog
						dismissable={true}
						visible={dialog_message.visible}
						onDismiss={() => {
							set_dialog_message({ visible: false, actions: [], title: "", description: "" })
						}}
					>
						{dialog_message.icon ? <Dialog.Icon icon={dialog_message.icon} /> : null}
						<Dialog.Title style={{ fontSize: 32 }}>{dialog_message.title}</Dialog.Title>

						<Text className="text-left bottom-5 text-truncate" variant="bodyMedium">
							{dialog_message.description}
						</Text>
						<Dialog.Actions>
							{dialog_message?.actions?.map((action) => (
								<Button
									disabled={action.disabled}
									key={action.text}
									onPress={() => {
										action.clicked()
									}}
									icon={action.icon}
								>
									{action.text}
								</Button>
							))}
						</Dialog.Actions>
					</Dialog>
				</Portal>
				<List.Section title={`Developer Panel U:${FCard.GetUser().name}`}>
					<List.Accordion title="Code Testing" left={(props) => <List.Icon className="pl-5" icon="code-braces-box" />}>
						<List.Item
							title="Fetch Balance"
							className="pl-10"
							left={(props) => <List.Icon icon="credit-card-outline" />}
							onPress={async () => {
								await getBalance()
							}}
						/>
						<TextInput
							defaultValue={data.card_no}
							placeholder="XXXXX-XXXXX-X"
							value={inputs.card_no}
							maxLength={13}
							label={"Card No"}
							className="pl-10"
							inputMode="numeric"
							right={
								<TextInput.Icon
									icon="refresh"
									onPress={() => {
										set_inputs({ ...inputs, card_no: "01809-43928-4" })
									}}
								/>
							}
							onChangeText={async (text) => {
								set_inputs({ ...inputs, card_no: text })
							}}
						/>
					</List.Accordion>
					<List.Accordion title="AppData" left={(props) => <List.Icon className="pl-5" icon="database" />}>
						<List.Item
							title="testing"
							className="pl-10"
							left={(props) => <List.Icon icon="import" />}
							onPress={async () => {
								set_dialog_message({
									visible: true,
									title: "Result",
									description: JSON.stringify(await FCard.GET_DATA("testing")),
									actions: [
										{
											clicked: () => {
												set_dialog_message({ visible: false })
											},
											text: "Ok",
										},
									],
								})
							}}
						/>

						<List.Item
							title="language"
							className="pl-10"
							left={(props) => <List.Icon icon="import" />}
							onPress={async () => {
								set_dialog_message({
									visible: true,
									title: "Result",
									description: JSON.stringify(await FCard.GET_DATA("language")),
									actions: [
										{
											clicked: () => {
												set_dialog_message({ visible: false })
											},
											text: "Ok",
										},
									],
								})
							}}
						/>
						<List.Item
							title="region"
							className="pl-10"
							left={(props) => <List.Icon icon="import" />}
							onPress={async () => {
								set_dialog_message({
									visible: true,
									title: "Result",
									description: JSON.stringify(await FCard.GET_DATA("region")),
									actions: [
										{
											clicked: () => {
												set_dialog_message({ visible: false })
											},
											text: "Ok",
										},
									],
								})
							}}
						/>
						<List.Item
							title="latest_page"
							className="pl-10"
							left={(props) => <List.Icon icon="import" />}
							onPress={async () => {
								set_dialog_message({
									visible: true,
									title: "Result",
									description: JSON.stringify(await FCard.GET_DATA("latest_page")),
									actions: [
										{
											clicked: () => {
												set_dialog_message({ visible: false })
											},
											text: "Ok",
										},
									],
								})
							}}
						/>
						<List.Item
							title="user"
							className="pl-10"
							left={(props) => <List.Icon icon="account" />}
							onPress={async () => {
								set_dialog_message({
									visible: true,
									title: "Result",
									description: JSON.stringify(await FCard.GET_DATA("user")),
									actions: [
										{
											clicked: () => {
												set_dialog_message({ visible: false })
											},
											text: "Ok",
										},
									],
								})
							}}
						/>
					</List.Accordion>
				</List.Section>
			</Surface>
		</Fragment>
	)
}
