import { FCard } from "./FCard"

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
	public static async LogIn(username: string, password: string): Promise<User | undefined> {
		const is_username = User.is_input_phone(username)
		console.log(`Attempting to login ${username} ${password.slice(0, 1)}... ${is_username ? "username" : "phone number"}`)
		const region = await FCard.GET_DATA("region").then((region) => region)
		const body = {
			clientId: "rH7S2",
			countryCode: "tr",
			phoneNumber: `${username}`,
			pin: `${password}`,
			loginType: is_username ? "phone" : "email",
			responseType: "code",
		}
		const response = await fetch(
			`https://auth.kentkart.com/rl1/oauth/authorize?region=004&authType=4&version=Web_1.6.4_1.0_CHROME_kentkart.web.mkentkart&lang=tr`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			}
		).then((res) => res.json())
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

		const response2 = await fetch("https://auth.kentkart.com/rl1/oauth/token?region=004&authType=4&version=Web_1.6.4_1.0_CHROME_kentkart.web.mkentkart&lang=tr", {
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
		await FCard.SET_DATA("user", user)
		return user
	}
	public toJson(): string {
		return JSON.stringify(this)
	}
	public static fromJson(json: string): User {
		return JSON.parse(json)
	}

}
