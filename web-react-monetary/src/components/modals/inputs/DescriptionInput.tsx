import { Dispatch, SetStateAction } from "react"

import { Box, Text, Textarea } from "@chakra-ui/react"

const DescriptionInput = ({
	description,
	setDescription
}: {
	description: string
	setDescription: Dispatch<SetStateAction<string>>
}) => {
	return (
		<Box>
			<Text>Description</Text>
			<Textarea
				value={description}
				onChange={e => setDescription(e.target.value)}
			/>
		</Box>
	)
}

export default DescriptionInput
