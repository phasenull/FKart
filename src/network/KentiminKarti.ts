import { createContext, useContext, useState } from "react"
import { MD2DarkTheme, MD3DarkTheme } from "react-native-paper"
import { useColorScheme } from "react-native"
import User from "./User"
import createStorage from 'typed-async-storage';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DB_schema } from "./DB_schema";
export abstract class KentiminKarti {
	private static _instance: KentiminKarti
	private static user: User
	private static language = "en"
	private static translations
	private static storage
	
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
	public static async __INIT__() {
		if (KentiminKarti.__metadata__.is_initialized) return
		console.log("[KentiminKarti/LOG]: Initializing KentiminKarti...")
		KentiminKarti.__metadata__.is_initialized = true
		KentiminKarti.storage = createStorage({
			name: "KentiminKarti_DB",
			schema: DB_schema,
			AsyncStorage
		})

		KentiminKarti.SET_SETTING("language", await KentiminKarti.storage.get("language") || "en")


		console.log("[KentiminKarti/LOG]: KentiminKarti initialized.")
	}
	public static TRANSLATIONS_GET() {
		if (!KentiminKarti.translations) {
			console.log("\x1b[31m No translation file is loaded\x1b[0m")
			KentiminKarti.TRANSLATIONS_REFRESH()
		}
		if (!(KentiminKarti.language == KentiminKarti.translations["language_locale_code"])) KentiminKarti.TRANSLATIONS_REFRESH()
		return KentiminKarti.translations
	}
	public static TRANSLATIONS_REFRESH() {
		KentiminKarti.translations = KentiminKarti.READ_TRANSLATION_FILE(KentiminKarti.language)
	}
	public static GET_AVAILABLE_LANGUAGES() {
		return ["en", "tr"]
	}
	public static async Login(username: string, password: string) {
		const user = new User(username, password)
		if (!user) {
			throw new Error("App Error: Invalid username or password.")
			return
		}
		KentiminKarti.user = user
		return user
	}
	public static Logout() {
		KentiminKarti.user = undefined
	}
	public static GetUser() {
		console.log("User",KentiminKarti.user)
		return KentiminKarti.user || new User("ERROR", "", true)
	}
	public static GetLoggedUser() {
		return KentiminKarti.GetUser()
	}
	public static SET_SETTING(key, value) {
		if (!key || !value) throw new Error(`App Error: Invalid key / value (${key} ${value}).`)
		switch (key) {
			case "language":
				try {
					if (!value) throw new Error(`App Error: Can't change settings for (${key}) because value is null (KentminKarti.language).`)
					console.log(`[KentiminKarti/LOG]: Setting language to ${value}`)
					KentiminKarti.language = value
					KentiminKarti.translations = KentiminKarti.READ_TRANSLATION_FILE(value)
					return true
				} catch {
					throw new Error(`App Error: Invalid language (${value})`)
				}
			default:
				return
		}
	}
	public static DB() {
		return KentiminKarti.storage
	}
	public static async LOGIN_AS_INCOGNITO() {
		const user = new User("anonymous user", "", true)
		KentiminKarti.user = user
	}
	public static async SET_DATA(key, value) {
		return await KentiminKarti.storage.set(key, value)
	}
	public static async GET_DATA(key) {
		return (await KentiminKarti.storage.get(key))
	}

	public static GET_THEME() {
		return useColorScheme()
	}

	public static GET_SETTINGS() {
		return {
			language: KentiminKarti.language,
		}
	}
}
