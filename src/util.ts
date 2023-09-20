import { KentiminKarti } from "./network/KentiminKarti"

export function validate(input, type) {
	if (!type || !input) return [false, null]
	switch (type) {
		case "email":
			const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
			const is_valid = input.match(regex)
			if (is_valid) {
				return [true, null]
			}
			return [false, "Invalid email"]
		case "password":
			if (input.length < 8) return [false, "Password must be at least 8 characters"]
			if (input.includes(" ")) return [false, "Password must not include spaces"]
			if (input.length >= 60) return [false, "Password must be less than 60 characters"]
			return [true, null]
		case "confirm_password":
			return validate(input, "password")
		case "name":
			if (input.length < 2) return [false, "Name must be at least 2 characters"]
			if (input.includes(" ")) return [false, "Name must not include spaces"]
			if (input.length >= 20) return [false, "Name must be less than 20 characters"]
		default:
			return [false, "unknown error"]
	}
}
export function get_app_name() {
	return "Kentimin Kartı"
}
export function Translated(key: string, language?: String) {
	key = key.toLowerCase()
	language = language || KentiminKarti.GET_SETTINGS().language
	if (!language) throw new Error("Language not set")

	let TRANSLATIONS

	TRANSLATIONS = KentiminKarti.TRANSLATIONS_GET()
	// console.log("util.tsx:",TRANSLATIONS["language_locale_code"])
	if (!TRANSLATIONS) throw new Error(`Translation file not found (${language})`)
	// console.log(`[KentiminKarti/LOG]: Translation of (${key}) is (${TRANSLATIONS[key]}) in language ${language}`)
	return TRANSLATIONS[key] || `unknown_key::${key}::${language}`
}
console.log(`Setting language to ${Translated("language_locale")}`)

export async function LOGIN_AS_INCOGNITO() {
	return await KentiminKarti.LOGIN_AS_INCOGNITO()
}
