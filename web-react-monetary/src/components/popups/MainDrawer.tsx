import { useNavigate } from "react-router-dom"

import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import {
	Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter,
	DrawerHeader, DrawerOverlay, useColorMode, useColorModeValue
} from "@chakra-ui/react"

import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"

interface iNavItem {
	title: string
	navigate: string
	render: boolean
}

const MainDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()

	const navigate = useNavigate()
	const { toggleColorMode } = useColorMode()

	const items: iNavItem[] = [
		{
			title: "Home",
			navigate: "/",
			render: true
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
			title: "Budgets",
			navigate: "/budgets",
			render: !!token
		},
		{
			title: "Debts",
			navigate: "/debts",
			render: !!token
		},
		{
			title: "Settings",
			navigate: "/settings",
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
				<DrawerFooter>
					<Button
						sx={{
							display: "block",
							w: "full"
						}}
						variant="outline"
						leftIcon={useColorModeValue(<SunIcon />, <MoonIcon />)}
						onClick={toggleColorMode}>
						Toggle Theme
					</Button>
				</DrawerFooter>
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