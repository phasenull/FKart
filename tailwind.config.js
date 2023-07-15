/** @type {import('tailwindcss').Config} */
// tailwind.config.js

module.exports = {
	content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#2d86fa",
				secondary: "#fff",
				accent: "#82b8ff",
				"primary-dark": "#190045",
				"secondary-dark": "#000",
				"accent-dark": "#300182",
			}
		},
	},
	plugins: [],
}
