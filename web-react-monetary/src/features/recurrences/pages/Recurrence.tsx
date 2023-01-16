import { useParams } from "react-router-dom"

import { Container, Heading } from "@chakra-ui/react"

import { useGetAccountQuery } from "../../../api/accounts"
import { useGetCategoryQuery } from "../../../api/categories"
import { useGetRecurrenceQuery } from "../../../api/recurrences"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import RecurrenceDetails from "../components/RecurrenceDetails"
import TransactionList from "../components/TransactionList"

const Recurrence = ({}: {}) => {
	const { token } = useOnlyAuthenticated()
	const { recurrence_id } = useParams()

	const { data: recurrence, error: recurrenceError } = useGetRecurrenceQuery({
		token,
		recurrence_id: recurrence_id!
	})
	const { data: fromAccount, error: fromAccountError } = useGetAccountQuery(
		{ token, account_id: recurrence?.from_account_id ?? "" },
		{ skip: !recurrence }
	)
	const { data: toAccount, error: toAccountError } = useGetAccountQuery(
		{ token, account_id: recurrence?.to_account_id ?? "" },
		{ skip: !recurrence || !recurrence.to_account_id }
	)
	const { data: category, error: categoryError } = useGetCategoryQuery(
		{
			token,
			category_id: recurrence?.category_id ?? ""
		},
		{ skip: !recurrence }
	)

	useToastError(recurrenceError, true)
	useToastError(fromAccountError, true)
	useToastError(toAccountError, true)
	useToastError(categoryError, true)

	return (
		<Container variant="page">
			<RecurrenceDetails
				recurrence={recurrence ?? null}
				fromAccount={fromAccount ?? null}
				toAccount={toAccount ?? null}
				category={category ?? null}
			/>
			<Heading
				sx={{
					mt: 6,
					ml: 2
				}}
				size="md">
				Transactions
			</Heading>
			<TransactionList
				recurrence={recurrence ?? null}
				fromAccount={fromAccount ?? null}
				toAccount={toAccount ?? null}
				category={category ?? null}
			/>
		</Container>
	)
}

export default Recurrence
