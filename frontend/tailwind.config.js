const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

colors.neutral['850'] = '#1F1F1F'

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				gray: colors.neutral,
				'primary': colors.fuchsia,
			},
			fontFamily: {
				sans: ['"Inter var"', ...defaultTheme.fontFamily.sans],
				mono: ['"Source Code Pro"', ...defaultTheme.fontFamily.mono],
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/line-clamp'),
		require('@tailwindcss/aspect-ratio'),
		require("a17t")
	],
}
