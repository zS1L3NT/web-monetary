import { useMemo } from "react"
import { useNavigate } from "react-router-dom"

import { Badge, Box, Card, CardBody, Flex, Heading, Progress, Text } from "@chakra-ui/react"

import Account from "../../../models/account"
import Budget from "../../../models/budget"
import Category from "../../../models/category"
import Transaction from "../../../models/transaction"

const BudgetItem = ({
	budget,
	transactions,
	accounts,
	categories
}: {
	budget: Budget
	transactions: Transaction[] | null
	accounts: Account[] | null
	categories: Category[] | null
}) => {
	const navigate = useNavigate()

	const spent = useMemo(
		() =>
			(transactions ?? [])
				.filter(t => t.type === "Outgoing")
				.reduce((acc, el) => acc + el.amount, 0),
		[transactions]
	)

	return (
		<Card
			sx={{
				transition: "transform 0.3s",
				cursor: "pointer",
				":hover": {
					transform: "scale(1.01)"
				}
			}}
			onClick={() => navigate(budget.id)}>
			<CardBody>
				<Flex sx={{ justifyContent: "space-between" }}>
					<Heading size="md">
						{budget.name}

						<Badge sx={{ ml: 2 }}>
							{budget.period_type === "Day" ? "Daily" : budget.period_type + "ly"}
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
							left: Math.max(5, Math.min(95, (spent / budget.amount) * 100)) + "%"
						}}>
						${spent}
					</Text>
				</Box>
			</CardBody>
		</Card>
	)
}

export default BudgetItem
