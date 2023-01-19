import { useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { AddIcon, DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons"
import { Button, Flex, IconButton, Show, Text, useDisclosure } from "@chakra-ui/react"

import AddCategoryModal from "./popups/AddCategoryModal"
import AddRecurrenceModal from "./popups/AddRecurrenceModal"
import AddTransactionModal from "./popups/AddTransactionModal"
import DeleteModelAlertDialog from "./popups/DeleteModelAlertDialog"
import EditCategoryModal from "./popups/EditCategoryModal"
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

				{action === "Edit" ? (
					<>
						<Show above="md">
							<Button
								sx={{ mr: 2 }}
								variant="outline"
								colorScheme="red"
								leftIcon={<DeleteIcon />}
								onClick={onDeleteAlertDialogOpen}>
								Delete {model}
							</Button>
						</Show>
						<Show below="md">
							<IconButton
								sx={{ mr: 2 }}
								aria-label={`Delete ${model}`}
								variant="outline"
								colorScheme="red"
								icon={<DeleteIcon />}
								onClick={onDeleteAlertDialogOpen}
							/>
						</Show>
					</>
				) : null}

				<Show above="md">
					<Button
						variant="outline"
						leftIcon={action === "Edit" ? <EditIcon /> : <AddIcon />}
						onClick={handleActionButtonClick}>
						{action} {model}
					</Button>
				</Show>
				<Show below="md">
					<IconButton
						aria-label={`${action} ${model}`}
						variant="outline"
						icon={action === "Edit" ? <EditIcon /> : <AddIcon />}
						onClick={handleActionButtonClick}
					/>
				</Show>

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
			</Flex>
		</>
	)
}

export default Navigator
