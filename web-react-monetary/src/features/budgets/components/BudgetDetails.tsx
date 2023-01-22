import { Fragment, useContext, useMemo } from "react"

import {
	Badge, Box, Card, CardBody, Flex, Heading, Progress, Skeleton, Text
} from "@chakra-ui/react"

import { AccountsContext } from "../contexts/AccountsContext"
import { BudgetContext } from "../contexts/BudgetContext"
import { CategoriesContext } from "../contexts/CategoriesContext"
import { TransactionsContext } from "../contexts/TransactionsContext"

const BudgetDetails = ({}: {}) => {
	const { budget } = useContext(BudgetContext)
	const { accounts } = useContext(AccountsContext)
	const { categories } = useContext(CategoriesContext)
	const { transactions } = useContext(TransactionsContext)

	const spent = useMemo(
		() =>
			(transactions ?? [])
				.filter(t => t.type === "Outgoing")
				.reduce((acc, el) => acc + el.amount, 0),
		[transactions]
	)

	return (
		<Card>
			<CardBody>
				{budget && accounts && categories ? (
					<>
						<Flex sx={{ justifyContent: "space-between" }}>
							<Heading size="md">
								{budget.name}

								<Badge sx={{ ml: 2 }}>
									{budget.period_type === "Day"
										? "Daily"
										: budget.period_type + "ly"}
								</Badge>
							</Heading>
							<Text
								sx={{
									display: "flex",
									mt: 1
								}}>
								${budget.amount}
							</Text>
						</Flex>

						<Progress
							sx={{ mt: 4 }}
							colorScheme={spent >= budget.amount ? "red" : "green"}
							value={(spent / budget.amount) * 100}
							isIndeterminate={!transactions || !accounts || !categories}
						/>

						<Box
							sx={{
								h: 21,
								mt: 1,
								position: "relative"
							}}>
							<Text
								sx={{
									position: "absolute",
									fontSize: 14,
									opacity: 0.75,
									transform: "translateX(-50%)",
									left:
										Math.max(5, Math.min(95, (spent / budget.amount) * 100)) +
										"%"
								}}>
								${spent}
							</Text>
						</Box>

						<Heading
							sx={{ mt: 5, mb: 1 }}
							size="sm">
							Accounts
						</Heading>
						<Flex
							sx={{
								gap: "0.25rem 0.75rem",
								flexWrap: "wrap"
							}}>
							{accounts.map(a => (
								<Box
									key={a.id}
									sx={{ display: "inline-block" }}>
									{a.renderAccount()}
								</Box>
							))}
						</Flex>

						<Heading
							sx={{ mt: 4 }}
							size="sm">
							Categories
						</Heading>
						<Flex
							sx={{
								gap: "0 0.5rem",
								flexWrap: "wrap"
							}}>
							{categories.map(c => (
								<Fragment key={c.id}>{c.renderCategory()}</Fragment>
							))}
						</Flex>
					</>
				) : (
					<Skeleton sx={{ h: "193.391px" }} />
				)}
			</CardBody>
		</Card>
	)
}

export default BudgetDetails
