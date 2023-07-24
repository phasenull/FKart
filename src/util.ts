const DEFAULT_LANG = "tr"
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
const _TRANSLATIONS = require(`./assets/lang/${DEFAULT_LANG}.json`)
if (!_TRANSLATIONS) {
	throw new Error("Invalid language")
}
const TRANSLATIONS: Map<string, string> = _TRANSLATIONS
export function get_app_name() {
	return "Kentimin Kartı"
}
export function Translated(key: string, language?: String) {
	key = key.toLowerCase()
	if (language && language !== DEFAULT_LANG && language !== "") {
		try {
			// const _new_TRANSLATIONS = require("./assets/lang/"+language+".json")
			// if (!_new_TRANSLATIONS) {
			// 	throw new Error("Invalid language")
			// }
			// const new_TRANSLATIONS = _new_TRANSLATIONS
			// if (!new_TRANSLATIONS[key]) {
			// 	throw new Error(`Invalid key ${key} in language ${language}`)
			// }
		} catch {
			throw new Error("Invalid language")
		}
	}
	// console.log(`DEBUG/LANGUAGE: ${language || DEFAULT_LANG} ${key} : ${TRANSLATIONS[key]}`)
	if (!TRANSLATIONS[key]) {
		throw new Error(`Line 52: Invalid key ${key} in language ${language || DEFAULT_LANG}`)
	}
	this.key = key
	return TRANSLATIONS[key]
}

console.log(`Setting default language to ${Translated("language_locale")}`)
