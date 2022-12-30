import { DateTime } from "luxon"
import { useContext } from "react"
import { Line } from "react-chartjs-2"

import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react"

import { iAccount } from "../../../api/accounts"
import AccountsContext from "../contexts/AccountsContext"
import TransactionsContext from "../contexts/TransactionsContext"

const LineGraphCard = ({}: {}) => {
	const { selectedAccounts } = useContext(AccountsContext)
	const { transactions } = useContext(TransactionsContext)

	const getAccountData = (account: iAccount): number[] => {
		let balance =
			account.initial_balance +
			transactions!
				.filter(t => t.from_account_id === account.id || t.to_account_id === account.id)
				.filter(t => DateTime.fromISO(t.date).diffNow("days").days < -30)
				.map(t => (t.from_account_id === account.id ? -t.amount : t.amount))
				.reduce((a, b) => a + b, 0)

		const data: number[] = [balance]

		for (let i = 30; i > 0; i--) {
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

	return (
		<Card
			w={{ base: "95%", lg: "47.5%" }}
			height="min"
			m={4}
			mr={{ base: 4, lg: 2 }}
			mb={{ base: 2, lg: 4 }}>
			<CardHeader>
				<Heading size="md">Spending Trends</Heading>
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
							labels: Array(31)
								.fill([new Date().getDate(), new Date().getMonth() + 1])
								.map(([d, m], i) => [d - i, m])
								.reverse()
								.map(([d, m]) => (d < 1 ? [d + 30, m - 1] : [d, m]))
								.map(([d, m]) => (m < 0 ? [d, m + 12] : [d, m]))
								.map(([d, m]) => `${d}/${m}`),
							datasets: selectedAccounts.map(sa => ({
								label: sa.name,
								data: getAccountData(sa),
								borderColor: sa.color,
								pointBackgroundColor: sa.color,
								pointRadius: 1.5,
								pointHoverRadius: 5,
								cubicInterpolationMode: "monotone",
								fill: true,
								tension: 0.4
							}))
						}}
					/>
				) : null}
			</CardBody>
		</Card>
	)
}

export default LineGraphCard
