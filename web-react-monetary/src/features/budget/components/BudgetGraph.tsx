import { DateTime, DateTimeUnit } from "luxon"
import { useContext, useMemo } from "react"
import { Line } from "react-chartjs-2"

import { Card, CardBody, Skeleton } from "@chakra-ui/react"

import { BudgetContext } from "../contexts/BudgetContext"
import { TransactionsContext } from "../contexts/TransactionsContext"

const BudgetGraph = ({}: {}) => {
	const { budget, budgetIsLoading } = useContext(BudgetContext)
	const { transactions } = useContext(TransactionsContext)

	const { labels, data } = useMemo(() => {
		if (!budget || !transactions) return { labels: [], data: [] }

		let date = DateTime.now().startOf(budget.period_type.toLowerCase() as DateTimeUnit)
		const labels: string[] = []
		const data: number[] = []

		while (
			!date.equals(
				DateTime.now()
					.startOf(budget.period_type.toLowerCase() as DateTimeUnit)
					.plus({ [budget.period_type.toLowerCase()]: 1 })
			)
		) {
			labels.push(date.toFormat("dd/MM"))
			if (date <= DateTime.now().startOf("day")) {
				data.push(
					transactions
						.filter(t => t.date.startOf("day").equals(date))
						.reduce((acc, el) => acc + el.amount, data.at(-1) ?? 0)
				)
			}

			date = date.plus({ days: 1 })
		}

		return { labels, data }
	}, [budget, transactions])

	return !budgetIsLoading && budget ? (
		<Card
			sx={{
				h: { base: "300px", sm: "400px", md: "500px" },
				mt: 4
			}}>
			<CardBody sx={{ width: "full" }}>
				<Line
					options={{
						maintainAspectRatio: false,
						scales: {
							x: {
								grid: {
									display: false
								}
							},
							y: {
								min: budget?.amount ?? 0,
								grid: {
									display: false
								}
							}
						},
						interaction: {
							intersect: false
						},
						plugins: {
							legend: {
								display: false
							}
						}
					}}
					data={{
						labels,
						datasets: [
							{
								data,
								borderColor: "green",
								pointBackgroundColor: "green",
								pointRadius: 1.5,
								pointHoverRadius: 5,
								cubicInterpolationMode: "monotone",
								fill: true,
								tension: 0.4
							}
						]
					}}
				/>
			</CardBody>
		</Card>
	) : budgetIsLoading ? (
		<Card
			sx={{
				h: { base: "300px", sm: "400px", md: "500px" },
				mt: 4
			}}>
			<CardBody sx={{ width: "full" }}>
				<Skeleton
					sx={{
						h: {
							base: "260px",
							sm: "360px",
							md: "460px"
						}
					}}
				/>
			</CardBody>
		</Card>
	) : null
}

export default BudgetGraph
