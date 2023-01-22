import { DateTime, DateTimeUnit } from "luxon"

import { Center, Container, Heading, Spinner, Stack } from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../../api/accounts"
import { useGetBudgetsQuery } from "../../../api/budgets"
import { useGetCategoriesQuery } from "../../../api/categories"
import { useGetTransactionsQuery } from "../../../api/transactions"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import BudgetItem from "../components/BudgetItem"

const Budgets = ({}: {}) => {
	const { token } = useOnlyAuthenticated()

	const {
		data: budgets,
		error: budgetsError,
		isLoading: budgetsAreLoading
	} = useGetBudgetsQuery({ token })
	const { data: transactions, error: transactionsError } = useGetTransactionsQuery({ token })
	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })
	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	useToastError(budgetsError, true)
	useToastError(transactionsError, true)
	useToastError(accountsError, true)
	useToastError(categoriesError, true)

	return (
		<Container variant="page">
			<Heading
				sx={{
					mt: 6,
					mb: 4
				}}
				size="md">
				Budgets
			</Heading>
			{!budgetsAreLoading && budgets ? (
				<Stack>
					{budgets.map(b => (
						<BudgetItem
							key={b.id}
							budget={b}
							transactions={
								transactions?.filter(
									t =>
										t.date
											.startOf(b.period_type.toLowerCase() as DateTimeUnit)
											.equals(
												DateTime.now().startOf(
													b.period_type.toLowerCase() as DateTimeUnit
												)
											) &&
										(b.account_ids?.includes(t.from_account_id) ||
											b.category_ids?.includes(t.category_id))
								) ?? null
							}
							accounts={accounts?.filter(a => b.account_ids.includes(a.id)) ?? null}
							categories={
								categories?.filter(c => b.category_ids.includes(c.id)) ?? null
							}
						/>
					))}
				</Stack>
			) : budgetsAreLoading ? (
				<Center>
					<Spinner />
				</Center>
			) : null}
		</Container>
	)
}

export default Budgets
