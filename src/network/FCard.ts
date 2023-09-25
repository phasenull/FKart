import { useColorScheme } from "react-native"
import createStorage from 'typed-async-storage';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DB_schema } from "./DB_schema";
import User from "./User";
export abstract class FCard {
	private static _instance: FCard
	private static user: User
	private static language = "en"
	private static translations
	private static storage
	private static region : string
	private static __metadata__ = {
		is_initialized: false,
	}
	public static READ_TRANSLATION_FILE(language: String) {
		let TRANSLATIONS
		switch (language.toString()) {
			case "tr":
				console.log("READING TURKISH FILE ")
				TRANSLATIONS = require(`./../assets/lang/tr.json`)
				break
			default:
				console.log("READING ENGLISH FILE ")
				TRANSLATIONS = require(`./../assets/lang/en.json`)
				break
		}
		console.log(`[KentiminKarti/LOG]: \x1b[36mTranslation file ${language} (${TRANSLATIONS["language_locale"]}) read.\x1b[0m`)
		return TRANSLATIONS
	}
	public static async GET_REGIONS() {
		const url = "https://service.kentkart.com/rl1//api/v2.0/city"
		return fetch(url).then((response) => response.json()).then((json) => json.city)
	}
	public static async __INIT__() {
		if (FCard.__metadata__.is_initialized) return
		console.log("[KentiminKarti/LOG]: Initializing KentiminKarti...")
		FCard.__metadata__.is_initialized = true
		FCard.storage = createStorage({
			name: "KentiminKarti_DB",
			schema: DB_schema,
			AsyncStorage
		})

		FCard.SET_SETTING("language", await FCard.storage.get("language") || "en")


		console.log("[KentiminKarti/LOG]: KentiminKarti initialized.")
	}
	public static TRANSLATIONS_GET() {
		if (!FCard.translations) {
			console.log("\x1b[31m No translation file is loaded\x1b[0m")
			FCard.TRANSLATIONS_REFRESH()
		}
		if (!(FCard.language == FCard.translations["language_locale_code"])) FCard.TRANSLATIONS_REFRESH()
		return FCard.translations
	}
	public static TRANSLATIONS_REFRESH() {
		FCard.translations = FCard.READ_TRANSLATION_FILE(FCard.language)
	}
	public static GET_AVAILABLE_LANGUAGES() {
		return [{name:"English",id:"en"}, {name:"Türkçe",id:"tr"}]
	}
	
	public static SetUser(user:User) {
		FCard.user = user
	}
	public static async GetUser() {
		if (!FCard.user) {
			const user = await FCard.storage.get("user")
			if (!user) return
			FCard.user = new User(user)
		}
		return FCard.user
	}
	public static SET_SETTING(key, value) {
		if (!key || !value) throw new Error(`App Error: Invalid key / value (${key} ${value}).`)
		switch (key) {
			case "language":
				try {
					if (!value) throw new Error(`App Error: Can't change settings for (${key}) because value is null (KentminKarti.language).`)
					console.log(`[KentiminKarti/LOG]: Setting language to ${value}`)
					FCard.language = value
					FCard.translations = FCard.READ_TRANSLATION_FILE(value)
					FCard.SET_DATA("language",value)
					return true
				} catch {
					throw new Error(`App Error: Invalid language (${value})`)
				}
			case "region":
				try {
					if (!value) throw new Error(`App Error: Can't change settings for (${key}) because value is null (KentminKarti.language).`)
					console.log(`[KentiminKarti/LOG]: Setting region to ${value}`)
					FCard.region = value
					FCard.SET_DATA("region", value)
				} catch {
					throw new Error(`App Error: Invalid region (${JSON.stringify(value)})`)
				}
			default:
				return
		}
	}
	public static DB() {
		return FCard.storage
	}
	public static async LOGIN_AS_INCOGNITO() {
		// const user = new User("anonymous user", "", true)
		// KentiminKarti.user = user
	}
	public static async SET_DATA(key, value) {
		return await FCard.storage.set(key, value)
	}
	public static async GET_DATA(key) {
		const data = await FCard.storage.get(key)
		if (!data) return undefined
		return data
	}
	public static async LogOut() {
		await FCard.SET_DATA("user", undefined)
		FCard.user = undefined
		return true
	}
	public static GET_THEME() {
		return useColorScheme()
	}

	public static GET_SETTINGS() {
		return {
			language: FCard.language,
			region: FCard.region,
		}
	}
}
