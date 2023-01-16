import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import { AddIcon, HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons"
import {
	Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader,
	DrawerOverlay, Flex, IconButton, Text, Tooltip, useColorMode, useColorModeValue, useDisclosure
} from "@chakra-ui/react"

import AuthContext from "../contexts/AuthContext"
import AddTransactionModal from "./AddTransactionModal"

interface iNavItem {
	title: string
	navigate: string
	render: boolean
}

const Navigator = () => {
	const { token } = useContext(AuthContext)
	const { toggleColorMode } = useColorMode()
	const navigate = useNavigate()

	const {
		isOpen: isDrawerOpen,
		onToggle: onDrawerToggle,
		onClose: onDrawerClose
	} = useDisclosure()
	const {
		isOpen: isAddTransactionModalOpen,
		onOpen: onAddTransactionModalOpen,
		onClose: onAddTransactionModalClose
	} = useDisclosure()

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
		<>
			<Flex
				sx={{
					h: "60px",
					w: "full",
					alignItems: "center",
					p: 2,
					zIndex: 10,
					shadow: "lg"
				}}>
				<IconButton
					aria-label="Open Drawer"
					variant="ghost"
					onClick={onDrawerToggle}
					icon={
						<HamburgerIcon
							sx={{
								w: 5,
								h: 5
							}}
						/>
					}
				/>
				<Text
					sx={{
						ml: 2,
						fontFamily: "heading",
						fontWeight: "medium",
						fontSize: "xl",
						_hover: { cursor: "pointer" }
					}}
					onClick={() => navigate("/")}>
					Monetary
				</Text>

				<Tooltip label="Add Transaction">
					<IconButton
						sx={{ ml: "auto" }}
						aria-label="Add Transaction"
						variant="ghost"
						icon={<AddIcon />}
						onClick={onAddTransactionModalOpen}
					/>
				</Tooltip>

				<Tooltip label="Toggle Color Scheme">
					<IconButton
						sx={{ ml: 3 }}
						aria-label="Toggle Color Scheme"
						variant="ghost"
						icon={useColorModeValue(<SunIcon />, <MoonIcon />)}
						onClick={toggleColorMode}
					/>
				</Tooltip>

				<Drawer
					size={{ base: "full", md: "sm" }}
					placement="left"
					onClose={onDrawerClose}
					isOpen={isDrawerOpen}>
					<DrawerOverlay />
					<DrawerContent>
						<DrawerHeader
							sx={{ cursor: "pointer" }}
							onClick={() => {
								navigate("/")
								onDrawerClose()
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
											onDrawerClose()
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
				<AddTransactionModal
					isOpen={isAddTransactionModalOpen}
					onClose={onAddTransactionModalClose}
				/>
			</Flex>
		</>
	)
}

export default Navigator
