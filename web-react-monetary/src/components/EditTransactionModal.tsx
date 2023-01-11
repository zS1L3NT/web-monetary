import { DateTime } from "luxon"
import { useRef, useState } from "react"

import {
	Box, Button, ButtonGroup, Center, CircularProgress, Flex, Input, Modal, ModalBody,
	ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper,
	NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, Textarea
} from "@chakra-ui/react"

import { useGetAccountsQuery } from "../api/accounts"
import { useGetCategoriesQuery } from "../api/categories"
import { iTransaction, TransactionType, useUpdateTransactionMutation } from "../api/transaction"
import useOnlyAuthenticated from "../hooks/useOnlyAuthenticated"
import useToastError from "../hooks/useToastError"
import CategoryDropdown from "./CategoryDropdown"
import Dropdown from "./Dropdown"

const EditTransactionModal = ({
	transaction,
	isOpen,
	onClose
}: {
	transaction: iTransaction
	isOpen: boolean
	onClose: () => void
}) => {
	const { token } = useOnlyAuthenticated()

	const [updateTransaction, { isLoading, error: updateTransactionError }] =
		useUpdateTransactionMutation()
	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })
	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	const finalFocusRef = useRef(null)

	const [categoryId, setCategoryId] = useState(transaction.category_id)
	const [fromAccountId, setFromAcccountId] = useState(transaction.from_account_id)
	const [toAccountId, setToAcccountId] = useState(transaction.to_account_id ?? "-")
	const [type, setType] = useState(transaction.type)
	const [amount, setAmount] = useState(transaction.amount)
	const [description, setDescription] = useState(transaction.description)
	const [date, setDate] = useState(new Date(transaction.date))

	useToastError(accountsError, true)
	useToastError(categoriesError, true)
	useToastError(updateTransactionError)

	const handleEdit = async () => {
		if (!amount || !fromAccountId || !categoryId) {
			return
		}

		await updateTransaction({
			token,
			transaction_id: transaction.id,
			category_id: categoryId,
			from_account_id: fromAccountId,
			to_account_id: !toAccountId || toAccountId === "-" ? undefined : toAccountId,
			type,
			amount,
			description,
			date: date.toISOString()
		})
		onClose()
	}

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Transaction</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{accounts && categories ? (
						<>
							<ButtonGroup
								sx={{
									position: "relative",
									left: "50%",
									transform: "translateX(-50%)"
								}}
								isAttached
								variant="outline">
								{(["Outgoing", "Incoming", "Transfer"] as TransactionType[]).map(
									t => (
										<Button
											key={t}
											variant={type === t ? "primary" : "outline"}
											onClick={() => {
												if (type === "Transfer" && t !== "Transfer") {
													setToAcccountId("-")
												}
												setType(t)
											}}>
											{t}
										</Button>
									)
								)}
							</ButtonGroup>

							<Flex
								sx={{ mt: 4 }}
								gap={3}>
								<Box sx={{ w: "full" }}>
									<Text>{type === "Transfer" ? "From " : ""}Account</Text>
									<Dropdown
										choices={accounts
											.map(a => ({ id: a.id, text: a.name }))
											.filter(a => a.id !== toAccountId)}
										selectedChoiceId={fromAccountId}
										setSelectedChoiceId={selectedChoiceId =>
											setFromAcccountId(selectedChoiceId ?? fromAccountId)
										}
									/>
								</Box>
								{type === "Transfer" ? (
									<Box sx={{ w: "full" }}>
										<Text>To Account</Text>
										<Dropdown
											choices={[
												{ id: "-", text: "-" },
												...accounts.map(a => ({ id: a.id, text: a.name }))
											].filter(a => a.id !== fromAccountId)}
											selectedChoiceId={toAccountId}
											setSelectedChoiceId={selectedChoiceId =>
												setToAcccountId(selectedChoiceId ?? "-")
											}
										/>
									</Box>
								) : null}
							</Flex>

							<Text sx={{ mt: 4 }}>Amount</Text>
							<NumberInput
								defaultValue={amount}
								onBlur={e => setAmount(+e.target.value.replace(/^\$/, ""))}
								precision={2}
								step={0.05}>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>

							<Text sx={{ mt: 4 }}>Date and Time</Text>
							<Input
								type="datetime-local"
								value={DateTime.fromJSDate(date).toFormat("yyyy-MM-dd'T'HH:mm''")}
								onChange={e => setDate(new Date(e.target.value))}
							/>

							<Text sx={{ mt: 4 }}>Category</Text>
							<CategoryDropdown
								categories={categories}
								selectedCategoryId={categoryId}
								setSelectedCategoryId={selectedCategoryId =>
									setCategoryId(selectedCategoryId ?? categoryId)
								}
							/>

							<Text sx={{ mt: 4 }}>Description (optional)</Text>
							<Textarea
								value={description}
								onChange={e => setDescription(e.target.value)}
							/>
						</>
					) : (
						<Center>
							<CircularProgress />
						</Center>
					)}
				</ModalBody>
				<ModalFooter>
					<Button
						sx={{ mr: 3 }}
						onClick={onClose}>
						Close
					</Button>
					<Button
						variant="primary"
						isLoading={isLoading}
						disabled={!amount || !fromAccountId || !categoryId}
						onClick={handleEdit}>
						Edit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default EditTransactionModal
