import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import {
	Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader,
	DrawerOverlay
} from "@chakra-ui/react"

import AuthContext from "../../contexts/AuthContext"

interface iNavItem {
	title: string
	navigate: string
	render: boolean
}

const MainDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useContext(AuthContext)

	const navigate = useNavigate()

	const items: iNavItem[] = [
		{
			title: "Home",
			navigate: "/",
			render: !token
		},
		{
			title: "Login",
			navigate: "/login",
			render: !token
		},
		{
			title: "Register",
			navigate: "/register",
			render: !token
		},
		{
			title: "Dashboard",
			navigate: "/dashboard",
			render: !!token
		},
		{
			title: "Transactions",
			navigate: "/transactions",
			render: !!token
		},
		{
			title: "Recurrences",
			navigate: "/recurrences",
			render: !!token
		},
		{
			title: "Categories",
			navigate: "/categories",
			render: !!token
		},
		{
			title: "Debts",
			navigate: "/debts",
			render: !!token
		},
		{
			title: "Budgets",
			navigate: "/budgets",
			render: !!token
		},
		{
			title: "Accounts",
			navigate: "/accounts",
			render: !!token
		},
		{
			title: "Profile",
			navigate: "/profile",
			render: !!token
		},
		{
			title: "Logout",
			navigate: "/logout",
			render: !!token
		}
	]

	return (
		<Drawer
			size={{ base: "full", md: "sm" }}
			placement="left"
			onClose={onClose}
			isOpen={isOpen}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerHeader
					sx={{ cursor: "pointer" }}
					onClick={() => {
						navigate("/")
						onClose()
					}}>
					Monetary
				</DrawerHeader>
				<DrawerBody>
					<Divider sx={{ mt: -2 }} />
					{items.map(item =>
						item.render ? (
							<Button
								key={item.navigate}
								sx={{
									w: "full",
									display: "flex",
									justifyContent: "start",
									mt: 3
								}}
								variant="ghost"
								onClick={() => {
									navigate(item.navigate)
									onClose()
								}}>
								{item.title}
							</Button>
						) : null
					)}
				</DrawerBody>
				<DrawerCloseButton
					sx={{
						mt: 2,
						mr: 3
					}}
				/>
			</DrawerContent>
		</Drawer>
	)
}

export default MainDrawer
