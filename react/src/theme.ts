import { extendTheme } from "@chakra-ui/react"

export default extendTheme({
	initialColorMode: "light",
	useSystemColorMode: false,
	fonts: {
		heading: "Montserrat, sans-serif",
		body: "Montserrat, sans-serif"
	},
	semanticTokens: {
		colors: {
			primaryLight: {
				_light: "orange.300",
				_dark: "orange.400"
			},
			primary: {
				_light: "orange.400",
				_dark: "orange.500"
			},
			primaryDark: {
				_light: "orange.500",
				_dark: "blue.600"
			},
			background: {
				_light: "gray.100",
				_dark: "gray.900"
			},
			card: {
				_light: "white",
				_dark: "gray.700"
			},
			error: "red.500",
			bw: {
				_light: "black",
				_dark: "white"
			},
			text: {
				_light: "gray.700",
				_dark: "gray.200"
			},
			highlight: {
				_light: "gray.200",
				_dark: "gray.700"
			}
		}
	},
})
