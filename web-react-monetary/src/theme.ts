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
			highlight: "#F3ECB0",
			card: {
				_light: "#FAFAFA",
				_dark: "#2D3748"
			}
		}
	},
	components: {
		Text: {
			variants: {
				inputError: {
					color: "red.400",
					fontSize: "sm"
				}
			}
		},
		Button: {
			variants: {
				primary: {
					bg: "primary",
					color: "white",
					_hover: {
						bg: "primary !important"
					}
				}
			}
		}
	}
})
