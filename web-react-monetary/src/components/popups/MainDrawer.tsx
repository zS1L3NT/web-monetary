import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import {
	Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader,
	DrawerOverlay
} from "@chakra-ui/react"

import AuthContext from "../../contexts/AuthContext"
import { HiArchive, HiCash, HiChartPie, HiCollection, HiCreditCard, HiDatabase, HiHome, HiLogin, HiLogout, HiQuestionMarkCircle, HiRefresh, HiUser, HiUserAdd, HiUserGroup, HiViewList, HiXCircle } from "react-icons/hi"

interface iNavItem {
	title: string
	navigate: string
	icon: JSX.Element
	render: boolean
}

const MainDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useContext(AuthContext)

	const navigate = useNavigate()

	const items: iNavItem[] = [
		{
			title: "Home",
			navigate: "/",
			icon: <HiHome />,
			render: !token
		},
		{
			title: "Login",
			navigate: "/login",
			icon: <HiLogin />,
			render: !token
		},
		{
			title: "Register",
			navigate: "/register",
			icon: <HiUserAdd />,
			render: !token
		},
		{
			title: "Dashboard",
			navigate: "/dashboard",
			icon: <HiChartPie />,
			render: !!token
		},
		{
			title: "Profile",
			navigate: "/profile",
			icon: <HiUser />,
			render: !!token
		},
		{
			title: "Accounts",
			navigate: "/accounts",
			icon: <HiCollection />,
			render: !!token
		},
		{
			title: "Budgets",
			navigate: "/budgets",
			icon: <HiCreditCard />,
			render: !!token
		},
		{
			title: "Categories",
			navigate: "/categories",
			icon: <HiArchive />,
			render: !!token
		},
		{
			title: "Debts",
			navigate: "/debts",
			icon: <HiCash />,
			render: !!token
		},
		{
			title: "Recurrences",
			navigate: "/recurrences",
			icon: <HiRefresh />,
			render: !!token
		},
		{
			title: "Transactions",
			navigate: "/transactions",
			icon: <HiViewList />,
			render: !!token
		},
		{
			title: "Logout",
			navigate: "/logout",
			icon: <HiLogout />,
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
								leftIcon={item.icon}
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
