import React from "react"
import { FlatList, ScrollView, View, Dimensions } from "react-native"
import { Divider, Surface, Text, Title } from "react-native-paper"
import { FKart } from "../../../../network/FKart"

export function Last30Usages(props) {
	const { data, total } = props
	function render_item({ item }) {
		const date = item.formattedDate
		const type = item.type
		return (
			<View key={date} style={{ flexDirection: "row", flexWrap: "wrap" }} className="justify-between gap-x-5">
				<Text className="text-[18px]" style={{ color: `${item.type == "1" ? "red" : "green"}` }}>
					{type == 1 ? item.usageAmt : item.amount} TL
				</Text>
				<Text className="opacity-20 text-sm">{date}</Text>
			</View>
		)
	}
	return (
		<Surface {...props} mode="flat" elevation={2} className="w-80 self-center py-3 px-5 mt-2 rounded-[16px]">
			<Title className="text-[16px]">{data ? `Kullanımlar (${data?.length}x / ${total} TL):` : "Bu aya ait kullanım bulunmamaktadır."}</Title>
			{data ? (
				<React.Fragment>
					<FlatList
						windowSize={20}
						removeClippedSubviews={true}
						initialNumToRender={1}
						maxToRenderPerBatch={3}
						nestedScrollEnabled={true}
						scrollEnabled={true}
						data={data.slice(0, 30)}
						style={{ maxHeight: 300 }}
						className="mt-3 px-1"
						renderItem={render_item}
					></FlatList>
					<Text className="opacity-50 self-center mt-1">{FKart.TranslationFile().showing_of({showing:30,total:data.length})}</Text>
				</React.Fragment>
			) : null}
		</Surface>
	)
}
