import { DateTime } from "luxon"

import { Box, Card, CardBody, Flex, Heading, Skeleton, Text } from "@chakra-ui/react"

import Debt from "../../../models/debt"
import Transaction from "../../../models/transaction"

const DebtDetails = ({
	debt,
	transactions
}: {
	debt: Debt | undefined
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
					{debt ? (
						<Flex sx={{ justifyContent: "space-between" }}>
							<Box>
								<Heading size="lg">
									{debt.name}

									{debt.renderType()}
								</Heading>

								<Text
									sx={{
										mt: 4,
										opacity: 0.75
									}}>
									{debt.active ? "Active Debt" : "Inactive Debt"}
								</Text>

								<Text sx={{ opacity: 0.5 }}>{debt.description}</Text>
							</Box>
							<Box>
								{transactions ? (
									<Heading
										sx={{ textAlign: "right" }}
										size="md">
										{debt.getAmountLeft(transactions)}
									</Heading>
								) : (
									<Skeleton sx={{ h: "24px" }} />
								)}

								<Flex
									sx={{
										justifyContent: "end",
										alignItems: "center",
										mt: 4,
										gap: 1,
										fontSize: 16,
										opacity: 0.5
									}}>
									Total: ${debt.amount.toFixed(2)}
								</Flex>

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
						<Skeleton sx={{ h: "100px" }} />
					)}
				</CardBody>
			</Card>
		</>
	)
}

export default DebtDetails
