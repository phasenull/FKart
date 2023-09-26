import { NavigationProp } from "@react-navigation/native"
import React, { useState, Fragment, useEffect } from "react"
import { Button, List, Modal, Portal, Searchbar, Surface, Text } from "react-native-paper"
import { FKart } from "../../network/FKart"
export function LanguageModal(props) {

	const {navigation} = props

	const [modal, set_modal] = useState({ visible: true, language: "" })
	const languages = FKart.GET_AVAILABLE_LANGUAGES()
	const [selected_language, set_selected_language] = useState({ name: "", id: undefined })
	const [searchQuery, setSearchQuery] = React.useState(null)
	const {onLeave} = props
	const onChangeSearch = (query) => {
		setSearchQuery(query)
		console.log("searchQuery", searchQuery)
	}
	useEffect(() => {
		if (!selected_language.id) return
		console.log("language changed!", selected_language.id)
		FKart.SET_SETTING("language", selected_language.id)
		console.log("navigation", navigation)
		navigation.popToTop("Auth")
		navigation.replace("Auth")
	}, [selected_language.id])
	return (
		<Modal visible={modal.visible} onDismiss={() => {onLeave()}}>
			<Surface className={"p-5 m-5 rounded-xl overflow-hidden"} elevation={5} mode="elevated">
				<Text className="mb-5">Choose a language below:</Text>
				<Searchbar placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
				<List.Section className="h-max-[60%]">
					{(
						languages
							.filter((e) => {
								return searchQuery ? e.name.toLowerCase().startsWith(searchQuery?.toLowerCase()) : true
							})
							.map((language: { name: string; id: string }) => (
								<List.Item
								
									key={language.id}
									title={language.name}
									onPress={() => {
										set_selected_language({ id: language.id, name: language.name })
										set_modal({ visible: false, language: language.id })
										onLeave()
									}}
								/>
							))
					)}
				</List.Section>
			</Surface>
		</Modal>
	)
}
