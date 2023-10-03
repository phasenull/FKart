import { useColorScheme } from "react-native"
import createStorage from "typed-async-storage"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DB_schema } from "./DB_schema"
import User from "./User"
import BaseTranslation from "../assets/lang/BaseTranslation"
export abstract class FKart {
	private static _instance: FKart
	private static user: User
	private static language = "en"
	private static translations: BaseTranslation
	private static storage
	private static region: string
	private static __metadata__ = {
		is_initialized: false,
	}
	private static __READ_TRANSLATION_FILE(language: string) {
		if (!language) throw new Error("App Error: Didnt pass language to FKart.READ_TRANSLATION_FILE")
		console.log(`[FKart/LOG]: Reading translation file (${language})...`)
		let TRANSLATIONS: BaseTranslation
		if (language == "en") {
			TRANSLATIONS = require("../assets/lang/en.ts")
		} else if (language == "tr") {
			TRANSLATIONS = require("../assets/lang/tr.ts")
		}
		if (!TRANSLATIONS) {
			new Error(`App Error: Invalid language (${language})`)
		}
		console.log(`[FKart/LOG]: \x1b[36mTranslation file (${TRANSLATIONS.language_locale}) read.\x1b[0m`)
		return TRANSLATIONS
	}
	public static async GET_REGIONS() {
		const url = "https://service.kentkart.com/rl1//api/v2.0/city"
		return fetch(url)
			.then((response) => response.json())
			.then((json) => json.city)
	}
	public static async __INIT__() {
		if (FKart.__metadata__.is_initialized) return
		console.log("[FKart/LOG]: Initializing FKart...")
		FKart.__metadata__.is_initialized = true
		FKart.storage = createStorage({
			name: "FKart_DB",
			schema: DB_schema,
			AsyncStorage,
		})

		FKart.SET_SETTING("language", (await FKart.storage.get("language")) || "en")

		console.log("[FKart/LOG]: FKart initialized.")
	}
	public static TRANSLATIONS_GET() {
		if (!FKart.translations) {
			console.log("\x1b[31m No translation file is loaded\x1b[0m")
			FKart.TRANSLATIONS_REFRESH()
		}
		// if (!(FKart.language == FKart.translations["language_locale_code"])) FKart.TRANSLATIONS_REFRESH()
		return FKart.translations
	}
	public static TRANSLATIONS_REFRESH() {
		FKart.translations = FKart.__READ_TRANSLATION_FILE(FKart.language)
	}
	public static TranslationFile(): BaseTranslation {
		if (!FKart.translations) FKart.TRANSLATIONS_REFRESH()
		return FKart.translations
	}
	public static GET_AVAILABLE_LANGUAGES() {
		return [
			{ name: "English", id: "en" },
			{ name: "Türkçe", id: "tr" },
		]
	}

	public static async SetUser(user: User) {
		FKart.user = user
		await FKart.SET_DATA("user", user)
	}
	public static async GetUser() {
		if (!FKart.user) {
			const user = await FKart.storage.get("user")
			if (!user) return
			FKart.user = new User(user)
		}
		return FKart.user
	}
	public static SET_SETTING(key, value) {
		if (!key || !value) throw new Error(`App Error: Invalid key / value (${key} ${value}).`)
		switch (key) {
			case "language":
				try {
					if (!value) throw new Error(`App Error: Can't change settings for (${key}) because value is null (KentminKarti.language).`)
					if (FKart.GET_AVAILABLE_LANGUAGES().find((x) => x.id == value) == undefined) throw new Error(`App Error: Invalid language (${value})`)
					console.log(`[FKart/LOG]: Setting language to ${value}`)
					FKart.language = value
					FKart.translations = FKart.__READ_TRANSLATION_FILE(value)
					FKart.SET_DATA("language", value)
					return true
				} catch {
					throw new Error(`App Error: Invalid language (${value})`)
				}
			case "region":
				try {
					if (!value) throw new Error(`App Error: Can't change settings for (${key}) because value is null (KentminKarti.language).`)
					console.log(`[FKart/LOG]: Setting region to ${JSON.stringify(value)}`)
					FKart.region = value
					FKart.SET_DATA("region", value)
				} catch {
					throw new Error(`App Error: Invalid region (${JSON.stringify(value)})`)
				}
			default:
				return
		}
	}
	public static DB() {
		return FKart.storage
	}
	public static async LOGIN_AS_INCOGNITO() {
		// const user = new User("anonymous user", "", true)
		// FKart.user = user
	}
	public static async SET_DATA(key, value) {
		return await FKart.storage.set(key, value)
	}
	private static async __validate_db() {
		if (!FKart.storage) {
			console.log("[FKart/LOG]: DB is not initialized. Initializing...")
			FKart.storage = createStorage({
				name: "FKart_DB",
				schema: DB_schema,
				AsyncStorage,
			})
		}
		if (!FKart.__metadata__.is_initialized) await FKart.__INIT__()
	}
	public static async GET_DATA(key) {
		await FKart.__validate_db()
		const data = await FKart.storage.get(key)
		if (!data) return undefined
		return data
	}
	public static async LogOut() {
		await FKart.SET_DATA("user", undefined)
		FKart.user = undefined
		return true
	}
	public static GET_THEME() {
		return useColorScheme()
	}

	public static GET_SETTINGS() {
		return {
			language: FKart.language,
			region: FKart.region,
		}
	}
}
