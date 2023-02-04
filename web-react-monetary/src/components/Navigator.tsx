import { useContext, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { AddIcon, ArrowBackIcon, DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons"
import { Button, Flex, HStack, IconButton, Show, Text, useDisclosure } from "@chakra-ui/react"

import AuthContext from "../contexts/AuthContext"
import AddAccountModal from "./popups/AddAccountModal"
import AddBudgetModal from "./popups/AddBudgetModal"
import AddCategoryModal from "./popups/AddCategoryModal"
import AddDebtModal from "./popups/AddDebtModal"
import AddRecurrenceModal from "./popups/AddRecurrenceModal"
import AddTransactionModal from "./popups/AddTransactionModal"
import DeleteModelAlertDialog from "./popups/DeleteModelAlertDialog"
import EditBudgetModal from "./popups/EditBudgetModal"
import EditCategoryModal from "./popups/EditCategoryModal"
import EditDebtModal from "./popups/EditDebtModal"
import EditRecurrenceModal from "./popups/EditRecurrenceModal"
import MainDrawer from "./popups/MainDrawer"

const Navigator = () => {
	const { token } = useContext(AuthContext)

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
	const {
		isOpen: isAddBudgetModalOpen,
		onOpen: onAddBudgetModalOpen,
		onClose: onAddBudgetModalClose
	} = useDisclosure()
	const {
		isOpen: isEditBudgetModalOpen,
		onOpen: onEditBudgetModalOpen,
		onClose: onEditBudgetModalClose
	} = useDisclosure()
	const {
		isOpen: isAddAccountModalOpen,
		onOpen: onAddAccountModalOpen,
		onClose: onAddAccountModalClose
	} = useDisclosure()

	const action = useMemo(() => {
		if (location.pathname.match(/\/\w+\//) || location.pathname === "/profile") {
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
		} else if (location.pathname.startsWith("/budgets")) {
			return "Budget"
		} else if (location.pathname.startsWith("/accounts")) {
			return "Account"
		} else if (location.pathname === "/profile") {
			return "User"
		} else if (location.pathname === "/transactions" || location.pathname === "/dashboard") {
			return "Transaction"
		} else {
			return
		}
	}, [location])

	const models = useMemo(() => {
		if (model) {
			if (model === "Category") {
				return "Categories"
			}
			return model + "s"
		}
		return
	}, [model])

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
		} else if (location.pathname.startsWith("/budgets")) {
			if (location.pathname.startsWith("/budgets/")) {
				onEditBudgetModalOpen()
			} else {
				onAddBudgetModalOpen()
			}
		} else if (location.pathname.startsWith("/accounts")) {
			onAddAccountModalOpen()
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
					justifyContent: "space-between",
					alignItems: "center",
					p: 2,
					zIndex: 10,
					shadow: "lg"
				}}>
				<HStack>
					{location.pathname.match(/^\/\w*$/) ? (
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
					) : (
						<IconButton
							aria-label="Back"
							variant="ghost"
							onClick={() => navigate(-1)}
							icon={
								<ArrowBackIcon
									sx={{
										w: 5,
										h: 5
									}}
								/>
							}
						/>
					)}

					{location.pathname.match(/^\/\w*$/) ? (
						<Text
							sx={{
								fontFamily: "heading",
								fontWeight: "medium",
								fontSize: "xl",
								_hover: { cursor: "pointer" }
							}}
							onClick={() => navigate("/")}>
							{["/", "/login", "/register"].includes(location.pathname)
								? "Monetary"
								: location.pathname[1]!.toUpperCase() + location.pathname.slice(2)}
						</Text>
					) : null}
				</HStack>

				<HStack>
					{token && model && location.pathname !== "/profile" ? (
						<>
							<Show above="md">
								<Button
									variant="outline"
									leftIcon={action === "Edit" ? <EditIcon /> : <AddIcon />}
									onClick={handleActionButtonClick}
									data-cy={`${action}-${model}-button`.toLowerCase()}>
									{action} {model}
								</Button>
							</Show>
							<Show below="md">
								<IconButton
									aria-label={`${action} ${model}`}
									variant="outline"
									icon={action === "Edit" ? <EditIcon /> : <AddIcon />}
									onClick={handleActionButtonClick}
									data-cy={`${action}-${model}-button`.toLowerCase()}
								/>
							</Show>
						</>
					) : null}

					{action === "Edit" ? (
						<>
							<Show above="md">
								<Button
									variant="outline"
									colorScheme="red"
									leftIcon={<DeleteIcon />}
									onClick={onDeleteAlertDialogOpen}
									data-cy={`delete-${model}-button`.toLowerCase()}>
									Delete {model}
								</Button>
							</Show>
							<Show below="md">
								<IconButton
									aria-label={`Delete ${model}`}
									variant="outline"
									colorScheme="red"
									icon={<DeleteIcon />}
									onClick={onDeleteAlertDialogOpen}
									data-cy={`delete-${model}-button`.toLowerCase()}
								/>
							</Show>
						</>
					) : null}
				</HStack>

				<MainDrawer
					isOpen={isMainDrawerOpen}
					onClose={onMainDrawerClose}
				/>
				{token ? (
					<>
						{model ? (
							<DeleteModelAlertDialog
								model={model}
								isOpen={isDeleteAlertDialogOpen}
								onClose={onDeleteAlertDialogClose}
							/>
						) : null}
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
						<AddBudgetModal
							isOpen={isAddBudgetModalOpen}
							onClose={onAddBudgetModalClose}
						/>
						<EditBudgetModal
							isOpen={isEditBudgetModalOpen}
							onClose={onEditBudgetModalClose}
						/>
						<AddAccountModal
							isOpen={isAddAccountModalOpen}
							onClose={onAddAccountModalClose}
						/>
					</>
				) : null}
			</Flex>
		</>
	)
}

export default Navigator
