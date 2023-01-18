import { Dispatch, SetStateAction } from "react"
import { HexColorPicker } from "react-colorful"

import { Box, Text } from "@chakra-ui/react"

const ColorInput = ({
	color,
	setColor
}: {
	color: string
	setColor: Dispatch<SetStateAction<string>>
}) => {
	return (
		<Box>
			<Text>Color</Text>
			<HexColorPicker
				style={{
					width: "100%",
					marginTop: "0.25rem",
					padding: "0.5rem"
				}}
				color={color}
				onChange={setColor}
			/>
		</Box>
	)
}

export default ColorInput
