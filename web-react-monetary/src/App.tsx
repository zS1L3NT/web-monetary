import { Chart, registerables } from "chart.js"
import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"

import { Flex } from "@chakra-ui/react"

import Navigator from "./components/Navigator"
import Login from "./features/authentication/pages/Login"
import Logout from "./features/authentication/pages/Logout"
import Register from "./features/authentication/pages/Register"
import Dashboard from "./features/dashboard/pages/Dashboard"
import Landing from "./features/landing/pages/Landing"
import Transactions from "./features/transactions/pages/Transactions"

const App = () => {
	useEffect(() => {
		Chart.register(...registerables)
	}, [])

	return (
		<Flex
			sx={{
				w: "full",
				h: "full",
				flexDirection: "column"
			}}>
			<Navigator />
			<Flex
				sx={{
					flex: 1,
					overflowY: "scroll"
				}}>
				<Routes>
					<Route
						path="/"
						element={<Landing />}
					/>
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
					<Route
						path="dashboard"
						element={<Dashboard />}
					/>
					<Route
						path="transactions"
						element={<Transactions />}
					/>
				</Routes>
			</Flex>
		</Flex>
	)
}

export default App
