import { useParams } from "react-router-dom"

import { AddIcon } from "@chakra-ui/icons"
import {
	Center, Container, Flex, Heading, IconButton, Spinner, useDisclosure
} from "@chakra-ui/react"

import { useGetDebtQuery } from "../../../api/debts"
import { useGetTransactionsQuery } from "../../../api/transactions"
import AddDebtTransactionModal from "../../../components/popups/AddDebtTransactionModal"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import TransactionItem from "../../transaction/components/TransactionItem"
import DebtDetails from "../components/DebtDetails"

const Debt = ({}: {}) => {
	const { token } = useOnlyAuthenticated()

	const { debt_id } = useParams()

	const { data: debt, error: debtError } = useGetDebtQuery({
		token,
		debt_id: debt_id!
	})
	const {
		data: transactions,
		error: transactionsError,
		isLoading: transactionsAreLoading
	} = useGetTransactionsQuery(
		{
			token,
			transaction_ids: debt?.transaction_ids ?? []
		},
		{ skip: !debt || !debt.transaction_ids.length }
	)

	const {
		isOpen: isAddDebtTransactionModalOpen,
		onOpen: onAddDebtTransactionModalOpen,
		onClose: onAddDebtTransactionModalClose
	} = useDisclosure()

	useToastError(debtError, true)
	useToastError(transactionsError, true)

	return (
		<>
			<Container variant="page">
				<DebtDetails
					debt={debt}
					transactions={transactionsAreLoading ? undefined : transactions ?? []}
				/>
				<Flex sx={{ alignItems: "center" }}>
					<Heading
						sx={{
							flex: 1,
							mt: 6,
							mb: 4
						}}
						size="md">
						Transactions
					</Heading>
					<IconButton
						aria-label="Add transaction"
						variant="outline"
						icon={<AddIcon />}
						size="sm"
						onClick={onAddDebtTransactionModalOpen}
					/>
				</Flex>

				{transactions ? (
					transactions.map(t => (
						<TransactionItem
							key={t.id}
							transaction={t}
							recurrence={null}
							fullDate={true}
						/>
					))
				) : transactionsAreLoading ? (
					<Center sx={{ mt: 4 }}>
						<Spinner />
					</Center>
				) : null}
			</Container>
			{debt ? (
				<AddDebtTransactionModal
					debt={debt}
					isOpen={isAddDebtTransactionModalOpen}
					onClose={onAddDebtTransactionModalClose}
				/>
			) : null}
		</>
	)
}

export default Debt
