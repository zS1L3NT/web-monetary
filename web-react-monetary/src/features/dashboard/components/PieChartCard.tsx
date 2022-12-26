import { DateTime } from "luxon"
import { useContext } from "react"
import { Pie } from "react-chartjs-2"

import { Card, CardBody } from "@chakra-ui/react"

import { iCategory, useGetCategoriesQuery } from "../../../api/categories"
import { iTransaction } from "../../../api/transaction"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import AccountsContext from "../contexts/AccountsContext"
import TransactionsContext from "../contexts/TransactionsContext"

const PieChartCard = ({}: {}) => {
	const { token } = useOnlyAuthenticated()
	const { selectedAccounts } = useContext(AccountsContext)
	const { transactions } = useContext(TransactionsContext)

	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	useToastError(categoriesError, true)

	const inCategory = (transaction: iTransaction, category: iCategory): boolean => {
		if (transaction.category_id === category.id) return true
		return category.category_ids.some(c =>
			inCategory(transaction, categories!.find(c_ => c === c_.id)!)
		)
	}

	const getCategoryData = (category: iCategory) => {}

	const transactionsForMonth = transactions
		?.filter(
			t =>
				(selectedAccounts ?? []).find(sa => sa.id === t.from_account_id) ||
				(selectedAccounts ?? []).find(sa => sa.id === t.to_account_id)
		)
		.filter(t => DateTime.fromISO(t.date).diffNow("days").days > -30)

	return (
		<Card
			w="47.5%"
			height="min"
			m={2}
			ml={{ base: 2, lg: 1 }}
			mt={{ base: 1, lg: 2 }}>
			<CardBody>
				{categories && transactionsForMonth ? (
					<Pie
						data={{
							labels: categories
								.filter(c => c.category_ids.length !== 0)
								.map(c => c.name),
							datasets: [
								{
									label: "Monthly Spending",
									data: categories
										.filter(c => c.category_ids.length !== 0)
										.map(c =>
											transactionsForMonth.filter(t => inCategory(t, c))
										)
										.map(t => t.reduce((a, b) => a + b.amount, 0)),
									backgroundColor: categories
										.filter(c => c.category_ids.length !== 0)
										.map(c => c.color)
								}
							]
						}}
					/>
				) : null}
			</CardBody>
		</Card>
	)
}

export default PieChartCard
