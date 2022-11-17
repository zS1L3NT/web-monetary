import { Flex } from "@chakra-ui/react"

import Navigator from "./components/Navigator"

const App = () => {
	return (
		<Flex
			w="full"
			h="full"
			dir="column">
			<Navigator />
		</Flex>
	)
}

export default App
