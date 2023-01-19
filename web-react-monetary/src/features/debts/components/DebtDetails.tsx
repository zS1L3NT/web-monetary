import { DateTime } from "luxon"

import {
	Box, Card, CardBody, Center, Flex, Heading, Skeleton, Spinner, Text
} from "@chakra-ui/react"

import Account from "../../../models/account"
import Debt from "../../../models/debt"
import Transaction from "../../../models/transaction"

const DebtDetails = ({
	debt,
	account,
	transactions
}: {
	debt: Debt | undefined
	account: Account | undefined
	transactions: Transaction[] | undefined
}) => {
	return (
		<>
			<Heading
				sx={{
					mt: 6,
					mb: 4
				}}
				size="md">
				Debt
			</Heading>
			<Card sx={{ w: "full" }}>
				<CardBody>
					{debt && account ? (
						<Flex sx={{ justifyContent: "space-between" }}>
							<Box>
								<Heading size="lg">
									{debt.name}

									{debt.renderType()}
								</Heading>

								{account.renderAccount()}

								<Text
									sx={{
										mt: 4,
										opacity: 0.5
									}}>
									{debt.active ? "Active Debt" : "Inactive Debt"}
								</Text>

								<Text sx={{ opacity: 0.25 }}>{debt.description}</Text>
							</Box>
							<Box>
								<Heading
									sx={{ textAlign: "right" }}
									size="md">
									${debt.amount.toFixed(2)}
								</Heading>

								{transactions ? (
									(() => {
										const paid = transactions
											.map(t => t.getAmount(account))
											.reduce((acc, el) => acc + el, 0)
										const left = debt.amount - paid

										return (
											<Flex
												sx={{
													justifyContent: "end",
													alignItems: "center",
													mt: 4,
													gap: 1,
													fontSize: 16,
													opacity: 0.5
												}}>
												{left > 0
													? `$${left.toFixed(2)} left`
													: left < 0
													? `$${left.toFixed(2)} excess`
													: `Paid in exact`}
											</Flex>
										)
									})()
								) : (
									<Skeleton sx={{ h: "24px" }} />
								)}

								<Text
									sx={{
										textAlign: "right",
										color:
											DateTime.now() > debt.due_date ? "red.400" : "inherit",
										fontSize: 14,
										opacity: 0.5
									}}>
									Due by {debt.due_date.toFormat("d MMM yyyy")}
								</Text>
							</Box>
						</Flex>
					) : (
						<Center>
							<Spinner />
						</Center>
					)}
				</CardBody>
			</Card>
		</>
	)
}

export default DebtDetails
