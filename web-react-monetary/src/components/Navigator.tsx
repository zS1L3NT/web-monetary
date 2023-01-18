import { useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { AddIcon, EditIcon, HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons"
import {
	Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader,
	DrawerOverlay, Flex, IconButton, Text, Tooltip, useColorMode, useColorModeValue, useDisclosure
} from "@chakra-ui/react"

import AuthContext from "../contexts/AuthContext"
import AddCategoryModal from "./modals/AddCategoryModal"
import AddRecurrenceModal from "./modals/AddRecurrenceModal"
import AddTransactionModal from "./modals/AddTransactionModal"
import EditCategoryModal from "./modals/EditCategoryModal"
import EditRecurrenceModal from "./modals/EditRecurrenceModal"

interface iNavItem {
	title: string
	navigate: string
	render: boolean
}

const Navigator = () => {
	const { token } = useContext(AuthContext)

	const navigate = useNavigate()
	const location = useLocation()
	const { toggleColorMode } = useColorMode()

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
	const {
		isOpen: isAddRecurrenceModalOpen,
		onOpen: onAddRecurrenceModalOpen,
		onClose: onAddRecurrenceModalClose
	} = useDisclosure()
	const {
		isOpen: isEditRecurrenceModalOpen,
		onOpen: onEditRecurrenceModalOpen,
		onClose: onEditRecurrenceModalClose
	} = useDisclosure()
	const {
		isOpen: isAddCategoryModalOpen,
		onOpen: onAddCategoryModalOpen,
		onClose: onAddCategoryModalClose
	} = useDisclosure()
	const {
		isOpen: isEditCategoryModalOpen,
		onOpen: onEditCategoryModalOpen,
		onClose: onEditCategoryModalClose
	} = useDisclosure()

	const getLabel = () => {
		if (location.pathname.startsWith("/recurrences")) {
			if (location.pathname.startsWith("/recurrences/")) {
				return "Edit Recurrence"
			} else {
				return "Add Recurrence"
			}
		} else if (location.pathname.startsWith("/categories")) {
			if (location.pathname.startsWith("/categories/")) {
				return "Edit Category"
			} else {
				return "Add Category"
			}
		} else {
			return "Add Transaction"
		}
	}

	const getIcon = () => {
		if (location.pathname.match(/\/\w+\//)) {
			return <EditIcon />
		} else {
			return <AddIcon />
		}
	}

	const handleActionButtonClick = () => {
		if (location.pathname.startsWith("/recurrences")) {
			if (location.pathname.startsWith("/recurrences/")) {
				onEditRecurrenceModalOpen()
			} else {
				onAddRecurrenceModalOpen()
			}
		} else if (location.pathname.startsWith("/categories")) {
			if (location.pathname.startsWith("/categories/")) {
				onEditCategoryModalOpen()
			} else {
				onAddCategoryModalOpen()
			}
		} else {
			onAddTransactionModalOpen()
		}
	}

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

				<Button
					sx={{ ml: "auto" }}
					variant="outline"
					leftIcon={getIcon()}
					onClick={handleActionButtonClick}>
					{getLabel()}
				</Button>

				<Tooltip label="Toggle Color Scheme">
					<IconButton
						sx={{ ml: 3 }}
						aria-label="Toggle Color Scheme"
						variant="outline"
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
				<AddRecurrenceModal
					isOpen={isAddRecurrenceModalOpen}
					onClose={onAddRecurrenceModalClose}
				/>
				<EditRecurrenceModal
					isOpen={isEditRecurrenceModalOpen}
					onClose={onEditRecurrenceModalClose}
				/>
				<AddCategoryModal
					isOpen={isAddCategoryModalOpen}
					onClose={onAddCategoryModalClose}
				/>
				<EditCategoryModal
					isOpen={isEditCategoryModalOpen}
					onClose={onEditCategoryModalClose}
				/>
			</Flex>
		</>
	)
}

export default Navigator
