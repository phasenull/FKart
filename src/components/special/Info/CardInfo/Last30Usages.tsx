import React, { useEffect } from "react"
import { FlatList, ScrollView, View, Dimensions } from "react-native"
import { Divider, Surface, Text, Title } from "react-native-paper"
import { FKart } from "../../../../network/FKart"

export function Last30Usages(props) {
	const { data, index } = props
	const [transactions, set_transactions] = React.useState(null)
	const [total, set_total] = React.useState(0)
	async function get() {
		if (!data) {
			console.log("no data")
			return
		}
		if (!index) {
			console.log("no index")
			return
		}
		const this_year = index.year
		const this_month = index.month
		const transaction_list = await data.GetTransactions({ year: this_year, month: this_month + 1 })
		set_transactions(transaction_list)
	}

	function get_total() {
		if (!transactions) {
			return 0
		}
		const usages = transactions.filter((e) => e.type === "1")
		let total = 0
		usages.forEach((e) => (total += parseFloat(e.usageAmt)))
		return total
	}
	useEffect(() => {
		get()
	}, [])
	function render_item({ item }) {
		const date = item.formattedDate
		const type = item.type
		return (
			<View key={date} style={{ flexDirection: "row", flexWrap: "wrap" }} className="justify-between gap-x-5">
				<Text className="text-[18px] w-18" style={{ color: `${item.type == "1" ? "red" : "green"}` }}>
					{parseFloat(item.usageAmt || item.amount).toFixed(2)} TL
				</Text>
				<Text className="opacity-20 text-sm">{date}</Text>
			</View>
		)
	}
	return (
		<Surface {...props} mode="flat" elevation={2} className="w-80 self-center py-3 px-5 rounded-[16px]">
			{transactions ? (
				<React.Fragment>
					<Title className="text-[16px]">
						{index?.month + 1}. Ay {data ? `Kullanımlar (${data?.length}x / ${total} TL):` : null}
					</Title>
					<FlatList
						windowSize={20}
						removeClippedSubviews={true}
						initialNumToRender={20}
						maxToRenderPerBatch={30}
						nestedScrollEnabled={true}
						scrollEnabled={true}
						data={transactions}
						style={{ maxHeight: 300 }}
						className="mt-3 px-1"
						renderItem={render_item}
					></FlatList>
					<Text className="opacity-50 self-center mt-1">{FKart.TranslationFile().showing_of({ showing: transactions.length, total: transactions.length })}</Text>
				</React.Fragment>
			) : (
				<React.Fragment>
					<Text className="opacity-50 self-center mt-1">{FKart.TranslationFile().no_usage_this_month}</Text>
				</React.Fragment>
			)}
		</Surface>
	)
}
