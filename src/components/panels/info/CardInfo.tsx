import { Button, Surface, Text, Title } from "react-native-paper"
import React from "react"
import { ScrollView, View } from "react-native"
import { Image } from "react-native"
import { useClipboard } from "@react-native-clipboard/clipboard"
import Clipboard from "@react-native-clipboard/clipboard"
export function CardInfo(props) {
	const params = props.route?.params
	const card = params?.card
	const image = params?.image
	const { navigation } = props
	console.log(card)
	React.useEffect(() => {
		navigation.setOptions({ title: `${card.description} - ${card.alias}` })
	}, [])
	function get_relative_time(date) {
		
	}
	return (
		<React.Fragment>
			<Image className={"scale-[1] self-center left-2"} source={image} />
			<Title className="self-center font-bold mb-2 text-[24px]">{card.description}</Title>
			<Text variant="labelLarge" className="bg-cyan-600 rounded-full px-3 self-center font-bold" selectable={true}>{card.alias}</Text>
			<Text className="self-center text-[48px] font-bold">{card.balance} TL</Text>
			<Surface mode="flat" elevation={2} className="h-max h-max-48 pb-5 pt-1 px-5 m-2 rounded-[16px]">
				<Title className="text-[16px]">{card.loads_in_line ? `Yüklemeler (${card.loads_in_line?.length}):` : "Bekleyen yükleme bulunmamaktadır."}</Title>
				{card.loads_in_line ? (
					<ScrollView className="gap-y-3 mt-3">
						{card.loads_in_line?.map((e) => (
							<View key = {e.datetime+Math.random().toString()} className="flex flex-col px-5">
								<Text className="text-[18px]">
									{e.datetime || "???"} - {e.amount || "??"} TL
								</Text>
							</View>
						))}
					</ScrollView>
				) : null}
			</Surface>
		</React.Fragment>
	)
}
