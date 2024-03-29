import { Chart, registerables } from "chart.js"
import chartjsPluginAnnotation from "chartjs-plugin-annotation"
import { Route, Routes, useNavigate } from "react-router-dom"

import { Flex } from "@chakra-ui/react"

import Navigator from "./components/Navigator"
import Accounts from "./features/account/pages/Accounts"
import Login from "./features/authentication/pages/Login"
import Logout from "./features/authentication/pages/Logout"
import Profile from "./features/authentication/pages/Profile"
import Register from "./features/authentication/pages/Register"
import Budget from "./features/budget/pages/Budget"
import Budgets from "./features/budget/pages/Budgets"
import Categories from "./features/category/pages/Categories"
import Category from "./features/category/pages/Category"
import Dashboard from "./features/dashboard/pages/Dashboard"
import Debt from "./features/debt/pages/Debt"
import Debts from "./features/debt/pages/Debts"
import Landing from "./features/landing/pages/Landing"
import Recurrence from "./features/recurrence/pages/Recurrence"
import Recurrences from "./features/recurrence/pages/Recurrences"
import Transactions from "./features/transaction/pages/Transactions"

Chart.register(...registerables, chartjsPluginAnnotation)

const App = () => {
	window.$navigate = useNavigate()

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
						index
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
					<Route path="recurrences">
						<Route
							index
							element={<Recurrences />}
						/>
						<Route
							path=":recurrence_id"
							element={<Recurrence />}
						/>
					</Route>
					<Route path="categories">
						<Route
							index
							element={<Categories />}
						/>
						<Route
							path=":category_id"
							element={<Category />}
						/>
					</Route>
					<Route path="debts">
						<Route
							index
							element={<Debts />}
						/>
						<Route
							path=":debt_id"
							element={<Debt />}
						/>
					</Route>
					<Route path="budgets">
						<Route
							index
							element={<Budgets />}
						/>
						<Route
							path=":budget_id"
							element={<Budget />}
						/>
					</Route>
					<Route
						path="accounts"
						element={<Accounts />}
					/>
					<Route
						path="profile"
						element={<Profile />}
					/>
				</Routes>
			</Flex>
		</Flex>
	)
}

export default App
