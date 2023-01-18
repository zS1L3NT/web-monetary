import { extendTheme, ThemeComponents, ThemeConfig, withDefaultColorScheme } from "@chakra-ui/react"

export default extendTheme(
	{
		config: {
			initialColorMode: "dark",
			useSystemColorMode: false
		} satisfies ThemeConfig,
		fonts: {
			heading: "Nunito Sans, sans-serif",
			body: "Nunito Sans, sans-serif"
		},
		colors: {
			primary: {
				50: "#e1fbf5",
				100: "#c1ece0",
				200: "#9fdecb",
				300: "#7bd1b6",
				400: "#57c3a1",
				500: "#3faa88",
				600: "#2e846a",
				700: "#1f5e4b",
				800: "#0d3a2c",
				900: "#00150d"
			}
		},
		shadows: {
			outline: "0 0 0 3px rgb(123, 209, 182, 0.6)"
		},
		components: {
			Input: {
				defaultProps: {
					focusBorderColor: "primary.300"
				}
			},
			NumberInput: {
				defaultProps: {
					focusBorderColor: "primary.300"
				}
			},
			Textarea: {
				defaultProps: {
					focusBorderColor: "primary.300"
				}
			},
			Modal: {
				baseStyle: {
					dialog: {
						w: {
							base: "90%",
							md: "full"
						}
					}
				}
			},
			Container: {
				variants: {
					page: {
						maxW: {
							base: "full",
							md: "40rem",
							lg: "65rem",
							"2xl": "90rem"
						}
					}
				}
			},
			Text: {
				variants: {
					inputError: {
						color: "red.400",
						fontSize: "sm"
					}
				}
			}
		} satisfies ThemeComponents
	},
	withDefaultColorScheme({ colorScheme: "primary" })
)
