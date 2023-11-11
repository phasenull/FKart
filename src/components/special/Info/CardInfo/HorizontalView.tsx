import React from "react"

import { FlatList, ScrollView, View, Dimensions } from "react-native"
import { Divider, Surface, Text, Title } from "react-native-paper"
import { Last30Usages } from "./Last30Usages"

export function CardInfoHorizontalView(props) {
	const { width } = Dimensions.get("window")
	const page_count = 2
	const { data, transactions } = props
	function update_scroll(index) {
		if (index === scroll_index) return
		set_scroll_index(index)
	}
	const [scroll_index, set_scroll_index] = React.useState(0)
	function onScroll(e) {
		let pageNumber = Math.min(Math.max(Math.floor(e.nativeEvent.contentOffset.x / width + 0.5) + 1, 0), 2)
		update_scroll(pageNumber - 1)
	}

	function get_total() {
		if (!transactions) return 0
		const usages = transactions.filter((e) => e.type == 1)
		let total = 0
		usages.forEach((e) => (total += parseFloat(e.usageAmt)))
		return total
	}
	return (
		<React.Fragment>
			<ScrollView showsVerticalScrollIndicator={false} key={"horizontal_paginator"} pagingEnabled={true} showsHorizontalScrollIndicator={false} horizontal={true} className="h-max" onScroll={onScroll}>
				{/* usages */}
				<View style={{ width: width }}>
					<Last30Usages data={transactions} total = {get_total()}></Last30Usages>
				</View>
				{/* loads in line */}
				<View style={{ width: width }}>
					<Surface mode="flat" elevation={2} className="h-max w-80 self-center h-max-48 py-3 px-5 mt-2 rounded-[16px]">
						<Title className="text-[16px]">{data.loads_in_line ? `Bekleyen yüklemeler (${data.loads_in_line?.length}):` : "Bekleyen yükleme bulunmamaktadır."}</Title>
						{data.loads_in_line ? (
							<FlatList
								nestedScrollEnabled={true}
								style={{ maxHeight: 300 }}
								scrollEnabled={true}
								data={data.loads_in_line}
								renderItem={({ item }) => {
									console.log(item.datetime)
									return (
										<View key={item.datetime} className="flex flex-col px-5">
											<Text className="text-[18px]">
												{item.datetime || "???"} - {item.amount || "??"} TL
											</Text>
										</View>
									)
								}}
								className="gap-y-3 mt-3"
							></FlatList>
						) : null}
					</Surface>
				</View>
			</ScrollView>
			{/* scroll previewer */}
			<View className="self-center gap-x-1 my-5" style={{ flexWrap: "wrap", flexDirection: "row" }}>
				{[...Array(page_count)].map((e, i) => (
					<View key={i} className={`w-2 h-2 bg-gray-400 self-center rounded-full ${scroll_index === i ? "opacity-100 w-3 h-3" : "opacity-50"}`} />
				))}
			</View>
		</React.Fragment>
	)
}
