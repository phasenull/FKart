import React, { useEffect, useMemo } from "react"

import { FlatList, ScrollView, View, Dimensions } from "react-native"
import { Divider, Surface, Text, Title } from "react-native-paper"
import { Last30Usages } from "./Last30Usages"
import { exists } from "react-native-fs"
const SHOW_DATA_PAGES = 6
export function CardInfoHorizontalView(props) {
	const { width } = Dimensions.get("window")
	const page_count = 1 + SHOW_DATA_PAGES
	const { data } = props
	function update_scroll(index) {
		if (index === scroll_index) return
		set_scroll_index(index)
	}
	const [scroll_index, set_scroll_index] = React.useState(0)
	function onScroll(e) {
		let pageNumber = Math.min(Math.max(Math.floor(e.nativeEvent.contentOffset.x / width + 0.5) + 1, 0), page_count)
		update_scroll(pageNumber - 1)
	}
	const last_months = useMemo(() => {
		const results = []
		for (let i = 0; i < SHOW_DATA_PAGES; i++) {
			const date = new Date()
			date.setMonth(date.getMonth() - i)
			results.push(<Last30Usages key={i} index={{ year: date.getFullYear(), month: date.getMonth() }} data={data} />)
		}
		return results
	}, [])
	return (
		<React.Fragment>
			<ScrollView
				showsVerticalScrollIndicator={false}
				key={"horizontal_paginator"}
				pagingEnabled={true}
				showsHorizontalScrollIndicator={false}
				horizontal={true}
				className="h-max"
				onScroll={onScroll}
			>
				{/* loads in line */}
				<View style={{ width: width }}>
					<Surface mode="flat" elevation={2} className="h-max w-80 self-center h-max-48 py-3 px-5 mt-2 rounded-[16px]">
						<Text className="opacity-50 self-center mt-1">
							{data.loads_in_line ? `Bekleyen yüklemeler (${data.loads_in_line?.length}):` : "Bekleyen yükleme bulunmamaktadır."}
						</Text>
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
				{/* usages */}
				{last_months.map((e, i) => {
					return (
						<View key={i} style={{ width: width }}>
							{e}
						</View>
					)
				})}
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
