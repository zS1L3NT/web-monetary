import { ChartDataset } from "chart.js"
import { DateTime } from "luxon"
import { useContext, useMemo, useState } from "react"
import { Line } from "react-chartjs-2"
import { HiDotsVertical } from "react-icons/hi"

import {
	Box, Card, CardBody, CardHeader, Flex, Heading, Icon, IconButton, Text, useDisclosure
} from "@chakra-ui/react"

import { iAccount } from "../../../api/accounts"
import { getPeriodDays, getPeriodIntervals, Period } from "../../../utils/periodUtils"
import AccountsContext from "../contexts/AccountsContext"
import TransactionsContext from "../contexts/TransactionsContext"
import PeriodSelectModal from "./PeriodSelectModal"

const LineGraphCard = ({}: {}) => {
	const { selectedAccounts } = useContext(AccountsContext)
	const { transactions } = useContext(TransactionsContext)

	const {
		isOpen: isPeriodModalOpen,
		onOpen: onPeriodModalOpen,
		onClose: onPeriodModalClose
	} = useDisclosure()
	const [period, setPeriod] = useState<Period>(Period.ThisMonth)

	const getAccountData = (account: iAccount): number[] => {
		let balance =
			account.initial_balance +
			transactions!
				.filter(t => t.from_account_id === account.id || t.to_account_id === account.id)
				.filter(t => DateTime.fromISO(t.date).diffNow("days").days < -getPeriodDays(period))
				.map(t => (t.from_account_id === account.id ? -t.amount : t.amount))
				.reduce((a, b) => a + b, 0)

		const data: number[] = [balance]

		for (let i = getPeriodDays(period); i > 0; i--) {
			const date = DateTime.now().minus({ days: i })
			balance += transactions!
				.filter(t => t.from_account_id === account.id || t.to_account_id === account.id)
				.filter(t => Math.round(DateTime.fromISO(t.date).diff(date, "days").days) === 0)
				.map(t => (t.from_account_id === account.id ? -t.amount : t.amount))
				.reduce((a, b) => a + b, 0)
			data.push(balance)
		}

		return data
	}

	const datasets = useMemo(
		() =>
			selectedAccounts?.map<ChartDataset<"line", number[]>>(sa => ({
				label: sa.name,
				data: getAccountData(sa),
				borderColor: sa.color,
				pointBackgroundColor: sa.color,
				pointRadius: 1.5,
				pointHoverRadius: 5,
				cubicInterpolationMode: "monotone",
				fill: true,
				tension: 0.4
			})),
		[selectedAccounts, transactions, period]
	)

	return (
		<>
			<Card>
				<CardHeader>
					<Flex>
						<Box sx={{ flex: 1 }}>
							<Heading size="md">Spending Trend</Heading>
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
					{selectedAccounts && transactions ? (
						<Line
							height={300}
							options={{
								aspectRatio: 1.5,
								responsive: true,
								scales: {
									x: {
										grid: {
											display: false
										}
									},
									y: {
										grid: {
											display: false
										}
									}
								},
								interaction: {
									intersect: false
								}
							}}
							data={{
								labels: getPeriodIntervals(period),
								datasets: datasets!
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

export default LineGraphCard
