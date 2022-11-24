import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons"
import {
	Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader,
	DrawerOverlay, Flex, IconButton, Text, Tooltip, useColorMode, useColorModeValue, useDisclosure
} from "@chakra-ui/react"

import AuthContext from "../contexts/AuthContext"

interface iNavItem {
	title: string
	navigate: string
	render: boolean
}

const Navigator = () => {
	const { token } = useContext(AuthContext)
	const { toggleColorMode } = useColorMode()
	const navigate = useNavigate()

	const { isOpen, onToggle, onClose } = useDisclosure()

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
				onClick={onToggle}
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
				ml={2}>
				Monetary
			</Text>

			<Tooltip label="Toggle Color Scheme">
				<IconButton
					aria-label="Toggle Color Scheme"
					variant="ghost"
					ml="auto"
					icon={useColorModeValue(<SunIcon />, <MoonIcon />)}
					onClick={toggleColorMode}
				/>
			</Tooltip>

			<Drawer
				size={{ base: "full", md: "sm" }}
				placement="left"
				onClose={onClose}
				isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader>Monetary</DrawerHeader>
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
										onClose()
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
		</Flex>
	)
}

export default Navigator
