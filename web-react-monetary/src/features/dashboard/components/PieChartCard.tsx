import { DateTime } from "luxon"
import { useContext } from "react"
import { Pie } from "react-chartjs-2"

import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react"

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

	const transactionsForMonth = transactions
		?.filter(
			t =>
				(selectedAccounts ?? []).find(sa => sa.id === t.from_account_id) ||
				(selectedAccounts ?? []).find(sa => sa.id === t.to_account_id)
		)
		.filter(t => DateTime.fromISO(t.date).diffNow("days").days > -30)

	return (
		<Card
			w={{ base: "95%", lg: "47.5%" }}
			height="min"
			m={4}
			ml={{ base: 4, lg: 2 }}
			mt={{ base: 2, lg: 4 }}>
			<CardHeader>
				<Heading size="md">Monthly Spendings by Categories</Heading>
			</CardHeader>
			<CardBody>
				{categories && transactionsForMonth ? (
					<Pie
						options={{ aspectRatio: 1.5 }}
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
