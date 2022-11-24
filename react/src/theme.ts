import { extendTheme } from "@chakra-ui/react"

export default extendTheme({
	config: {
		initialColorMode: "dark",
		useSystemColorMode: false
	},
	fonts: {
		heading: "Nunito Sans, sans-serif",
		body: "Nunito Sans, sans-serif"
	},
	semanticTokens: {
		colors: {
			primary: "#6ECCAF",
			secondary: "#ADE792",
			highlight: "#F3ECB0"
		}
	}
})
