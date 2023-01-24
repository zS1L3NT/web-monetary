import { Chart, registerables } from "chart.js"
import { Route, Routes } from "react-router-dom"

import { Flex } from "@chakra-ui/react"

import Navigator from "./components/Navigator"
import Accounts from "./features/accounts/pages/Accounts"
import Login from "./features/authentication/pages/Login"
import Logout from "./features/authentication/pages/Logout"
import Register from "./features/authentication/pages/Register"
import Budget from "./features/budgets/pages/Budget"
import Budgets from "./features/budgets/pages/Budgets"
import Categories from "./features/categories/pages/Categories"
import Category from "./features/categories/pages/Category"
import Dashboard from "./features/dashboard/pages/Dashboard"
import Debt from "./features/debts/pages/Debt"
import Debts from "./features/debts/pages/Debts"
import Landing from "./features/landing/pages/Landing"
import Recurrence from "./features/recurrences/pages/Recurrence"
import Recurrences from "./features/recurrences/pages/Recurrences"
import Transactions from "./features/transactions/pages/Transactions"

Chart.register(...registerables)

const App = () => {
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
				</Routes>
			</Flex>
		</Flex>
	)
}

export default App
