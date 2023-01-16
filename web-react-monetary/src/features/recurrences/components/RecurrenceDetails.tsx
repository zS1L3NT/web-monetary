import { ArrowForwardIcon } from "@chakra-ui/icons"
import {
	Badge, Box, Card, CardBody, Center, Flex, Heading, Spinner, Tag, Text, Tooltip
} from "@chakra-ui/react"

import Account from "../../../models/account"
import Category from "../../../models/category"
import Recurrence from "../../../models/recurrence"
import textColorOnBackground from "../../../utils/textColorOnBackground"

const RecurrenceDetails = ({
	recurrence,
	fromAccount,
	toAccount,
	category
}: {
	recurrence: Recurrence | null
	fromAccount: Account | null
	toAccount: Account | null
	category: Category | null
}) => {
	const renderAccount = (name: string | undefined, color: string | undefined) => {
		return (
			<>
				<Box
					sx={{
						width: 4,
						height: 4,
						borderRadius: 4,
						bg: color
					}}
				/>
				<Text
					sx={{
						ml: 2,
						fontSize: 18,
						fontWeight: 500
					}}>
					{name}
				</Text>
			</>
		)
	}

	return (
		<Card
			sx={{
				width: "full",
				mt: 6
			}}>
			<CardBody>
				{recurrence ? (
					<Box sx={{ position: "relative" }}>
						<Heading>
							{recurrence.name}
							<Tooltip
								sx={{ textAlign: "center" }}
								label={
									recurrence.automatic
										? "Transactions are automatically added without your confirmation"
										: "Transactions require your confirmation to be created"
								}>
								<Badge
									sx={{ ml: 2 }}
									colorScheme={recurrence.automatic ? "green" : "red"}>
									{recurrence.automatic ? "AUTO" : "MANUAL"}
								</Badge>
							</Tooltip>
						</Heading>
						<Tag
							sx={{
								width: "fit-content",
								mt: 2,
								color: textColorOnBackground(category?.color),
								bg: category?.color
							}}
							variant="subtle">
							{category?.name}
						</Tag>
						<Text
							sx={{
								mt: 4,
								fontSize: 18,
								opacity: 0.5
							}}>
							{recurrence.formatPeriod()}
						</Text>
						<Text sx={{ opacity: 0.25 }}>{recurrence.description}</Text>
						<Box
							sx={{
								position: "absolute",
								top: 2,
								right: 0
							}}>
							<Heading
								sx={{
									textAlign: "right",
									color:
										recurrence.type === "Outgoing"
											? "red.500"
											: recurrence.type === "Incoming"
											? "green.500"
											: "yellow.500"
								}}
								size="md">
								{recurrence.type === "Outgoing"
									? "-"
									: recurrence.type === "Incoming"
									? "+"
									: ""}
								${recurrence.amount.toFixed(2)}
							</Heading>
							<Flex
								sx={{
									justifyContent: "right",
									alignItems: "center",
									mt: 2
								}}>
								{fromAccount
									? renderAccount(fromAccount.name, fromAccount.color)
									: null}
								{toAccount && recurrence.type === "Transfer" ? (
									<>
										<ArrowForwardIcon sx={{ mx: 2 }} />
										{renderAccount(toAccount!.name, toAccount!.color)}
									</>
								) : null}
							</Flex>
						</Box>
					</Box>
				) : (
					<Center>
						<Spinner />
					</Center>
				)}
			</CardBody>
		</Card>
	)
}

export default RecurrenceDetails
