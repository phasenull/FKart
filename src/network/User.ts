import { API_URL } from "."

export default class User {
	private static _instance: User
	public token: string
	public id: string
	public name: string
	public email: string
	public avatar: string
	public createdAt: string
	public updatedAt: string

	constructor(username: string, password: string, anonymous?: boolean) {
		if (User._instance) {
			return User._instance
		}
		console.log(`Attempting to login ${username} ${password.slice(0, 3)}...`)
		if (anonymous) {
			this.token = ""
			this.name = "anonymous"
			this.id = "-1"
			User._instance = this
			console.log()
			return this
		}
		this.Login(username, password).then((token) => {
			if (!token) {
				throw new Error("Error: Invalid username or password.")
			}
			this.token = token
			this.name = username
			User._instance = this
			console.log("Auth Successful!")
			return this
		})
	}
	private async Login(username: string, password: string): Promise<string|undefined> {
		const response = await fetch(`${API_URL}/auth/login`, {
			method: "POST",
			headers: {
				username: `${username}`,
				password: `${password}`,
			},
		}).then((res) => res.json())
		if (!response.is_ok) {
			throw new Error("Error: Auth failed.")
		}
		const token = response.is_ok == true && response.data.token
		return token || undefined
	}
	public static toJson(user: User): string {
		return JSON.stringify(user)
	}
	public static fromJson(json: string): User {
		return JSON.parse(json)
	}
	public static getInstance(username: string | undefined, password: string | undefined): User {
		return User._instance || (username && password && (User._instance = new User(username, password)))
	}
}
