import { DateTime } from "luxon"
import { useRef, useState } from "react"

import {
	Box, Button, ButtonGroup, Center, CircularProgress, Flex, Input, Modal, ModalBody,
	ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper,
	NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, Textarea
} from "@chakra-ui/react"

import { useGetAccountsQuery } from "../api/accounts"
import { useGetCategoriesQuery } from "../api/categories"
import { useCreateTransactionMutation } from "../api/transactions"
import useOnlyAuthenticated from "../hooks/useOnlyAuthenticated"
import useToastError from "../hooks/useToastError"
import CategoryDropdown from "./CategoryDropdown"
import Dropdown from "./Dropdown"

const AddTransactionModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()

	const [createTransaction, { isLoading, error: createTransactionError }] =
		useCreateTransactionMutation()
	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })
	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	const finalFocusRef = useRef(null)

	const [categoryId, setCategoryId] = useState<string | null>(null)
	const [fromAccountId, setFromAcccountId] = useState<string | null>(null)
	const [toAccountId, setToAcccountId] = useState<string | null>(null)
	const [type, setType] = useState<"Outgoing" | "Incoming" | "Transfer">("Outgoing")
	const [amount, setAmount] = useState<number>()
	const [description, setDescription] = useState("")
	const [date, setDate] = useState(new Date())

	useToastError(accountsError, true)
	useToastError(categoriesError, true)
	useToastError(createTransactionError)

	const handleCreate = async () => {
		if (invalid) return

		await createTransaction({
			token,
			category_id: categoryId,
			from_account_id: fromAccountId,
			to_account_id: toAccountId,
			type,
			amount,
			description,
			date: date.toISOString()
		})
		onClose()
	}

	const invalid =
		!fromAccountId || (type === "Transfer" && !toAccountId) || !categoryId || !amount

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Transaction</ModalHeader>
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
								{(["Outgoing", "Incoming", "Transfer"] as const).map(t => (
									<Button
										key={t}
										variant={type === t ? "solid" : "outline"}
										onClick={() => {
											if (type === "Transfer" && t !== "Transfer") {
												setToAcccountId(null)
											}
											setType(t)
										}}>
										{t}
									</Button>
								))}
							</ButtonGroup>

							<Flex
								sx={{ mt: 4 }}
								gap={3}>
								<Box sx={{ w: "full" }}>
									<Text>{type === "Transfer" ? "From " : ""}Account</Text>
									<Dropdown
										choices={accounts
											.filter(a => a.id !== toAccountId)
											.map(a => ({ id: a.id, text: a.name }))}
										selectedChoiceId={fromAccountId}
										setSelectedChoiceId={setFromAcccountId}
									/>
								</Box>
								{type === "Transfer" ? (
									<Box sx={{ w: "full" }}>
										<Text>To Account</Text>
										<Dropdown
											choices={accounts
												.filter(a => a.id !== fromAccountId)
												.map(a => ({ id: a.id, text: a.name }))}
											selectedChoiceId={toAccountId}
											setSelectedChoiceId={setToAcccountId}
										/>
									</Box>
								) : null}
							</Flex>

							<Text sx={{ mt: 4 }}>Amount</Text>
							<NumberInput
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
								setSelectedCategoryId={setCategoryId}
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
						variant="ghost"
						onClick={onClose}>
						Close
					</Button>
					<Button
						isLoading={isLoading}
						disabled={invalid}
						onClick={handleCreate}>
						Create
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default AddTransactionModal
