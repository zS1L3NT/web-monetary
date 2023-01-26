import { Dispatch, SetStateAction } from "react"

import { Box, Input, Text } from "@chakra-ui/react"

const NameInput = ({
	name,
	setName
}: {
	name: string
	setName: Dispatch<SetStateAction<string>>
}) => {
	return (
		<Box>
			<Text>Name</Text>
			<Input
				value={name}
				onChange={e => setName(e.target.value)}
				placeholder="Enter a name"
				data-cy="name-input"
			/>
		</Box>
	)
}

export default NameInput
