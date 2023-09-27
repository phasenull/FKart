import React, { useState, Fragment, useEffect } from "react"
import { ScrollView } from "react-native"
import { Button, List, Modal, Portal, Searchbar, Surface, Text } from "react-native-paper"
import { FKart } from "../../network/FKart"
import { Translated } from "../../util"
export function RegionChooser(props) {
	const [region, set_region] = useState({ name: undefined, id: undefined })
	const [modal, set_modal] = useState({ visible: false, region: "" })
	const [regions, set_regions] = useState([])
	async function get_region() {
		const data = await FKart.GET_DATA("region")
		set_region(data)
	}
	useEffect(() => {
		get_region()
		FKart.GET_REGIONS().then((regions) => {
			set_regions(regions)
		})
	}, [])
	const [searchQuery, setSearchQuery] = React.useState(null)

	const onChangeSearch = (query) => {
		setSearchQuery(query)
	}
	useEffect(() => {
		if (!region) return
		if (!region?.name) return
		FKart.SET_SETTING("region", region)
	}, [region])
	return (
		<Fragment>
			<Portal>
				<Modal visible={modal.visible} onDismiss={() => set_modal({ visible: false, region: modal.region })}>
					<Surface className={"p-5 m-5 rounded-xl overflow-hidden"} elevation={5} mode="elevated">
						<Text className="mb-5 text-center text-lg">Choose a region</Text>
						<Searchbar placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
						<Surface mode="flat" elevation={3} className={"rounded-[24px] h-96 px-3 mt-3 overflow-clip"}>
							<ScrollView showsHorizontalScrollIndicator={false}>
								{
									regions[0] ? (
										regions
											.filter((e: { name: string }) => {
												return searchQuery ? e.name.toLowerCase().startsWith(searchQuery.toLowerCase()) : true
											})
											.map((region) => (
												<List.Item
													key={region?.id}
													title={region?.name}
													onPress={() => {
														set_region({ id: region.id, name: region?.name })
														FKart.SET_SETTING("region", region)
														set_modal({ visible: false, region: region?.id })
													}}
												/>
											))
									) : (
										<Fragment>
											<Text>Error</Text>
										</Fragment>
									)
									// <Text className="mx-auto my-3 font-bold">Try searching something!</Text>
								}
							</ScrollView>
						</Surface>
					</Surface>
				</Modal>
			</Portal>
			<Button {...props} icon={"map-marker"} className="mb-1" mode="contained-tonal" onPress={() => set_modal({ visible: true, region: undefined })}>
				{region?.id ? `${Translated("selected_region").split("/*")[0]} ${region?.name}` : "Select Region"}
			</Button>
		</Fragment>
	)
}
