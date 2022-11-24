import { Route, Routes } from "react-router-dom"

import { Flex } from "@chakra-ui/react"

import Navigator from "./components/Navigator"
import Login from "./features/authentication/pages/Login"
import Logout from "./features/authentication/pages/Logout"
import Register from "./features/authentication/pages/Register"

const App = () => {
	return (
		<Flex
			w="full"
			h="full"
			direction="column">
			<Navigator />
			<Flex
				flex={1}
				overflowY="scroll">
				<Routes>
					<Route
						path="login"
						element={<Login />}
					/>
					<Route
						path="register"
						element={<Register />}
					/>
					<Route
						path="logout"
						element={<Logout />}
					/>
				</Routes>
			</Flex>
		</Flex>
	)
}

export default App
