import { DateTime } from "luxon"
import { useContext, useState } from "react"
import { Pie } from "react-chartjs-2"
import { HiDotsVertical } from "react-icons/hi"

import {
	Box, Card, CardBody, CardHeader, Flex, Heading, Icon, IconButton, Text, useDisclosure
} from "@chakra-ui/react"

import { iCategory, useGetCategoriesQuery } from "../../../api/categories"
import { iTransaction } from "../../../api/transaction"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import { getPeriodDays, Period } from "../../../utils/periodUtils"
import AccountsContext from "../contexts/AccountsContext"
import TransactionsContext from "../contexts/TransactionsContext"
import PeriodSelectModal from "./PeriodSelectModal"

const PieChartCard = ({}: {}) => {
	const { token } = useOnlyAuthenticated()
	const { selectedAccounts } = useContext(AccountsContext)
	const { transactions } = useContext(TransactionsContext)

	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	const {
		isOpen: isPeriodModalOpen,
		onOpen: onPeriodModalOpen,
		onClose: onPeriodModalClose
	} = useDisclosure()
	const [period, setPeriod] = useState<Period>(Period.ThisMonth)

	useToastError(categoriesError, true)

	const inCategory = (transaction: iTransaction, category: iCategory): boolean => {
		if (transaction.category_id === category.id) return true
		return category.category_ids.some(c =>
			inCategory(transaction, categories!.find(c_ => c === c_.id)!)
		)
	}

	const transactionsForPeriod = transactions
		?.filter(
			t =>
				(selectedAccounts ?? []).find(sa => sa.id === t.from_account_id) ||
				(selectedAccounts ?? []).find(sa => sa.id === t.to_account_id)
		)
		.filter(t => DateTime.fromISO(t.date).diffNow("days").days > -getPeriodDays(period))

	return (
		<>
			<Card
				sx={{
					w: {
						base: "95%",
						lg: "47.5%"
					},
					height: "min",
					m: 4,
					ml: {
						base: 4,
						lg: 2
					},
					mb: {
						base: 2,
						lg: 4
					}
				}}>
				<CardHeader>
					<Flex>
						<Box sx={{ flex: 1 }}>
							<Heading size="md">Spendings by Categories</Heading>
							<Text>{period}</Text>
						</Box>
						<IconButton
							aria-label="More Settings"
							icon={<Icon as={HiDotsVertical} />}
							onClick={onPeriodModalOpen}
						/>
					</Flex>
				</CardHeader>
				<CardBody>
					{categories && transactionsForPeriod ? (
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
												transactionsForPeriod.filter(t => inCategory(t, c))
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
			<PeriodSelectModal
				isOpen={isPeriodModalOpen}
				onClose={onPeriodModalClose}
				period={period}
				setPeriod={setPeriod}
			/>
		</>
	)
}

export default PieChartCard
