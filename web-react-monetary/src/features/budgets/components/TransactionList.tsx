import { useContext } from "react"

import { Center, Spinner } from "@chakra-ui/react"

import TransactionItem from "../../transactions/components/TransactionItem"
import { TransactionsContext } from "../contexts/TransactionsContext"

const TransactionList = ({}: {}) => {
	const { transactions, transactionsAreLoading } = useContext(TransactionsContext)

	return (
		<>
			{transactions ? (
				transactions.map(t => (
					<TransactionItem
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
		</>
	)
}

export default TransactionList
