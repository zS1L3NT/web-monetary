import { useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { AddIcon, DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons"
import { Button, Flex, IconButton, Show, Text, useDisclosure } from "@chakra-ui/react"

import AddCategoryModal from "./popups/AddCategoryModal"
import AddDebtModal from "./popups/AddDebtModal"
import AddRecurrenceModal from "./popups/AddRecurrenceModal"
import AddTransactionModal from "./popups/AddTransactionModal"
import DeleteModelAlertDialog from "./popups/DeleteModelAlertDialog"
import EditCategoryModal from "./popups/EditCategoryModal"
import EditDebtModal from "./popups/EditDebtModal"
import EditRecurrenceModal from "./popups/EditRecurrenceModal"
import MainDrawer from "./popups/MainDrawer"

const Navigator = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const {
		isOpen: isMainDrawerOpen,
		onToggle: onMainDrawerToggle,
		onClose: onMainDrawerClose
	} = useDisclosure()
	const {
		isOpen: isDeleteAlertDialogOpen,
		onOpen: onDeleteAlertDialogOpen,
		onClose: onDeleteAlertDialogClose
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
	const {
		isOpen: isAddDebtModalOpen,
		onOpen: onAddDebtModalOpen,
		onClose: onAddDebtModalClose
	} = useDisclosure()
	const {
		isOpen: isEditDebtModalOpen,
		onOpen: onEditDebtModalOpen,
		onClose: onEditDebtModalClose
	} = useDisclosure()

	const action = useMemo(() => {
		if (location.pathname.match(/\/\w+\//)) {
			return "Edit"
		} else {
			return "Add"
		}
	}, [location])

	const model = useMemo(() => {
		if (location.pathname.startsWith("/recurrences")) {
			return "Recurrence"
		} else if (location.pathname.startsWith("/categories")) {
			return "Category"
		} else if (location.pathname.startsWith("/debts")) {
			return "Debt"
		} else {
			return "Transaction"
		}
	}, [location])

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
		} else if (location.pathname.startsWith("/debts")) {
			if (location.pathname.startsWith("/debts/")) {
				onEditDebtModalOpen()
			} else {
				onAddDebtModalOpen()
			}
		} else {
			onAddTransactionModalOpen()
		}
	}

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
					onClick={onMainDrawerToggle}
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
						mr: "auto",
						fontFamily: "heading",
						fontWeight: "medium",
						fontSize: "xl",
						_hover: { cursor: "pointer" }
					}}
					onClick={() => navigate("/")}>
					Monetary
				</Text>

				<Show above="md">
					<Button
						sx={{ mr: 2 }}
						variant="outline"
						leftIcon={action === "Edit" ? <EditIcon /> : <AddIcon />}
						onClick={handleActionButtonClick}>
						{action}
					</Button>
				</Show>
				<Show below="md">
					<IconButton
						sx={{ mr: 2 }}
						aria-label={`${action} ${model}`}
						variant="outline"
						icon={action === "Edit" ? <EditIcon /> : <AddIcon />}
						onClick={handleActionButtonClick}
					/>
				</Show>

				{action === "Edit" ? (
					<>
						<Show above="md">
							<Button
								variant="outline"
								colorScheme="red"
								leftIcon={<DeleteIcon />}
								onClick={onDeleteAlertDialogOpen}>
								Delete
							</Button>
						</Show>
						<Show below="md">
							<IconButton
								aria-label={`Delete ${model}`}
								variant="outline"
								colorScheme="red"
								icon={<DeleteIcon />}
								onClick={onDeleteAlertDialogOpen}
							/>
						</Show>
					</>
				) : null}

				<MainDrawer
					isOpen={isMainDrawerOpen}
					onClose={onMainDrawerClose}
				/>
				<DeleteModelAlertDialog
					model={model}
					isOpen={isDeleteAlertDialogOpen}
					onClose={onDeleteAlertDialogClose}
				/>
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
				<AddDebtModal
					isOpen={isAddDebtModalOpen}
					onClose={onAddDebtModalClose}
				/>
				<EditDebtModal
					isOpen={isEditDebtModalOpen}
					onClose={onEditDebtModalClose}
				/>
			</Flex>
		</>
	)
}

export default Navigator
