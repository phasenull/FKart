export default class Card {
	public readonly alias: string
	public readonly description?: string
	public readonly favorite_id?: string
	public readonly blacklist_status?: boolean
	public readonly card_no?: string
	public readonly card_type?: string
	public readonly expire_date?: string
	public readonly is_expired?: boolean
	public readonly is_active?: boolean
	public readonly is_personalized?: boolean
	public readonly is_user_card?: boolean
	public readonly is_virtual_card?: boolean
	public readonly producty_code?: string
	public readonly system_id?: string
	public readonly last_usages?: any[]
	public readonly balance?: number
	public readonly loads_in_line?: any[]

	constructor({
		alias,
		description,
		favorite_id,
		blacklist_status,
		card_no,
		card_type,
		expire_date,
		is_expired,
		is_active,
		is_personalized,
		is_user_card,
		is_virtual_card,
		product_code,
		system_id,
		last_usages,
		balance,
		loads_in_line,
	}: {
		alias: string
		description?: string
		favorite_id?: string
		blacklist_status?: boolean
		card_no?: string
		card_type?: string
		expire_date?: string
		is_expired?: boolean
		is_active?: boolean
		is_personalized?: boolean
		is_user_card?: boolean
		is_virtual_card?: boolean
		product_code?: string
		system_id?: string
		last_usages?: any[]
		balance?: number
		loads_in_line?: any[]
	}) {
		this.alias = alias
		this.description = description
		this.favorite_id = favorite_id
		this.blacklist_status = blacklist_status
		this.card_no = card_no
		this.card_type = card_type
		this.expire_date = expire_date
		this.is_expired = is_expired
		this.is_active = is_active
		this.is_personalized = is_personalized
		this.is_user_card = is_user_card
		this.is_virtual_card = is_virtual_card
		this.producty_code = product_code
		this.system_id = system_id
		this.last_usages = last_usages
		this.balance = balance
		this.loads_in_line = loads_in_line
	}

	public static FETCH_CARD_DATA({ region, alias, token }: { region: string; alias: string; token: string }) {
		const url = `https://service.kentkart.com/rl1/api/card/balance?region=${region}&lang=tr&authType=4&token=${token}&alias=${alias}`
		return fetch(url)
	}
	public static fromJSON(json: any): Card {
		const card = new Card({
			alias: json.aliasNo,
			description: json.description,
			favorite_id: json.favId,
			blacklist_status: json.blacklistStatus === "1" ? true : false,
			card_no: json.cardNo,
			card_type: json.cardType,
			expire_date: json.expiredDate,
			is_expired: json.expiredStatus === "1" ? true : false,
			is_active: json.isActive === "1" ? true : false,
			is_personalized: json.isPersonalized === "1" ? true : false,
			is_user_card: json.userCard === "1" ? true : false,
			is_virtual_card: json.virtualCard === "1" ? true : false,
			product_code: json.product_code,
			system_id: json.systemId,
			last_usages: json.usage,
			balance: json.balance,
			loads_in_line: json.oChargeList,
		})
		return card
	}
}
