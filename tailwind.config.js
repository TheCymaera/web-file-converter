import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config}*/
export default {
  content: ["./**/*.{html,js,svelte,ts}"],

	experimental: {
		optimizeUniversalDefaults: true,
	},

	future: {
		hoverOnlyWhenSupported: true,
	},

  theme: {
    extend: {
			colors: {
				primary: colors.teal,
				onPrimary: colors.white,
				surface: `#eee`,
				onSurface: `#333`,
				surfaceContainer: `#fff`,
				onSurfaceContainer: `#333`,
				divider: "#aaa",
				inkWell: "#333"
			},

			//animation: {
			//	loadingBar: "loadingBar 1s infinite",
			//},

			//keyframes: {
			//	loadingBar: {
			//		"0%": { transform: "translateX(-100%)" },
			//		"100%": { transform: "translateX(100%)" },
			//	},
			//},
		},
  },

  plugins: [],
};