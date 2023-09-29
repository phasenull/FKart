export default class User {
	private static _instance: User
	public token: string
	public id: string
	public username: string
	public email: string
	public avatar: string
	public createdAt: string
	public updatedAt: string
	public static is_input_phone(username: string): boolean {
		return username.length == 10 && !isNaN(Number(username))
	}
	constructor({ username, anonymous, token }: { username: string; token?: string; anonymous?: boolean }) {
		if (anonymous) {
			this.token = ""
			this.username = "anonymous"
			this.id = "-1"
			User._instance = this
			return this
		}

		this.token = token
		this.username = username
		return this
	}
	public static phone_to_country_code(phone: string): string {
		return "tr"
	}
	public static async LogIn(username: string, password: string, region: string): Promise<User | undefined> {
		if (!username || !password) {
			throw new Error("Username or password is empty!")
		}
		if (!region) {
			throw new Error("Region is empty!")
		}
		const is_username = User.is_input_phone(username)
		console.log(`Attempting to login ${username} ${password.slice(0, 1)}... ${is_username ? "username" : "phone number"}`)
		const body = {
			clientId: "rH7S2",
			countryCode: "tr",
			phoneNumber: `${username}`,
			pin: `${password}`,
			loginType: is_username ? "phone" : "email",
			responseType: "code",
		}
		const response = await fetch(`https://auth.kentkart.com/rl1/oauth/authorize?region=${region}&authType=4`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		}).then((res) => res.json())
		// console.log("Auth response", response)
		// console.log("body", body)
		if (response.result?.code !== 0) {
			if (response.result?.message) {
				throw new Error(`${response.result.message}`)
			}
			throw new Error("Auth failed!")
		}
		const one_time_code = response.code
		// console.log("recieved code", one_time_code)

		const response2 = await fetch("https://auth.kentkart.com/rl1/oauth/token?region=004&authType=4", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				clientId: "rH7S2",
				clientSecret: "Om121T12fSv1j66kp9Un5vE9IMkJ3639",
				code: one_time_code,
				grantType: "authorizationCode",
				redirectUri: "m.kentkart.com",
			}),
		}).then((res) => res.json())
		// console.log("Auth response2", response2)
		if (response2.result.code !== 0) {
			throw new Error("Get Token failed.")
		}
		const user = new User({ username: username, token: response2.accessToken })
		// console.log("Logged in user: ", user)
		return user
	}
	public async GetFavorites(region: string) {
		const url = `https://service.kentkart.com/rl1/api/v4.0/favorite?region=${region}&authType=4`
		const request = await fetch(url, { headers: { Authorization: `Bearer ${this.token}` } })
		const data = await request.json()
		return data
	}
	public async DeleteFavorite({ favId, region_id }: { favId: string; region_id: string }) {
		const url = `https://service.kentkart.com/rl1/api/v3.0/favorite?region=${region_id}&authType=4&favId=${favId}`
		const request = await fetch(url, { headers: { Authorization: `Bearer ${this.token}` }, method: "delete" })
		const data = await request.json()
		return data
	}
	public async AddFavorite({ region_id, type, favorite, description }: { region_id: string; type: "card"; favorite: string; description?: string }) {
		const type_data = {
			"card": 2,
		}
		const fallback_name = Date.now().toString(36) + Math.random().toString(36).substring(2)
		const final_name = description || fallback_name
		console.log("sending_data", final_name,type_data[type],favorite,region_id )
		const url = `https://service.kentkart.com/rl1/api/v3.0/favorite?region=${region_id}&authType=4&description=${final_name}&type=${type_data[type]}&favorite=${favorite}`
		const request = await fetch(url, { headers: { Authorization: `Bearer ${this.token}` }, method: "post" })
		const data = await request.json()
		return data
	}
	public toJson(): string {
		return JSON.stringify(this)
	}
	public static fromJson(json: string): User {
		return JSON.parse(json)
	}
}
