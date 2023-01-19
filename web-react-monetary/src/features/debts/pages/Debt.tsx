import { useParams } from "react-router-dom"

import { AddIcon } from "@chakra-ui/icons"
import {
	Center, Container, Flex, Heading, IconButton, Spinner, useDisclosure
} from "@chakra-ui/react"

import { useGetAccountQuery } from "../../../api/accounts"
import { useGetDebtQuery } from "../../../api/debts"
import { useGetTransactionsQuery } from "../../../api/transactions"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import TransactionItem from "../../transactions/components/TransactionItem"
import DebtDetails from "../components/DebtDetails"

const Debt = ({}: {}) => {
	const { token } = useOnlyAuthenticated()

	const { debt_id } = useParams()

	const { data: debt, error: debtError } = useGetDebtQuery({
		token,
		debt_id: debt_id!
	})
	const { data: account, error: accountError } = useGetAccountQuery(
		{
			token,
			account_id: debt?.account_id ?? ""
		},
		{ skip: !debt }
	)
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
		isOpen: isAddTransactionModalOpen,
		onOpen: onAddTransactionModalOpen,
		onClose: onAddTransactionModalClose
	} = useDisclosure()

	useToastError(debtError, true)
	useToastError(accountError, true)
	useToastError(transactionsError, true)

	return (
		<>
			<Container variant="page">
				<DebtDetails
					debt={debt}
					account={account}
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
						onClick={onAddTransactionModalOpen}
					/>
				</Flex>

				{transactions ? (
					transactions.map(t => (
						<TransactionItem
							transaction={t}
							recurrence={null}
						/>
					))
				) : transactionsAreLoading ? (
					<Center sx={{ mt: 4 }}>
						<Spinner />
					</Center>
				) : null}
			</Container>
		</>
	)
}

export default Debt
