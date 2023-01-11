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
				h="60px"
				w="full"
				bg="card"
				p={2}
				shadow="lg"
				zIndex={10}
				align="center">
				<IconButton
					aria-label="Open Drawer"
					variant="ghost"
					onClick={onDrawerToggle}
					icon={
						<HamburgerIcon
							w={5}
							h={5}
						/>
					}
				/>
				<Text
					fontFamily="heading"
					fontWeight="medium"
					fontSize="xl"
					ml={2}
					_hover={{ cursor: "pointer" }}
					onClick={() => navigate("/")}>
					Monetary
				</Text>

				<Tooltip label="Add Transaction">
					<IconButton
						aria-label="Add Transaction"
						variant="ghost"
						ml="auto"
						icon={<AddIcon />}
						onClick={onAddTransactionModalOpen}
					/>
				</Tooltip>

				<Tooltip label="Toggle Color Scheme">
					<IconButton
						aria-label="Toggle Color Scheme"
						variant="ghost"
						ml={3}
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
							_hover={{ cursor: "pointer" }}
							onClick={() => {
								navigate("/")
								onDrawerClose()
							}}>
							Monetary
						</DrawerHeader>
						<DrawerBody>
							<Divider mt={-2} />
							{items.map(item =>
								item.render ? (
									<Button
										key={item.navigate}
										w="full"
										display="flex"
										justifyContent="start"
										mt={3}
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
							mt={2}
							mr={3}
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
