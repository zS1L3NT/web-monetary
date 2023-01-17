import { DateTime } from "luxon"
import { useContext, useRef } from "react"

import {
	AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
	AlertDialogOverlay, Box, Button, Card, CardBody, Flex, Heading, Stack, Text, useDisclosure
} from "@chakra-ui/react"

import Transaction from "../../../models/transaction"
import CategoryContext from "../contexts/CategoryContext"
import AccountsContext from "../contexts/AccountsContext"

const TransactionItem = ({ date, transaction }: { date: DateTime; transaction?: Transaction }) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const cancelRef = useRef(null)

	const { fromAccount, toAccount } = useContext(AccountsContext)
	const { category } = useContext(CategoryContext)

	const handleConfirm = () => {}

	return (
		<>
			<Card sx={{ bg: transaction ? "gray.800" : "gray.700" }}>
				<CardBody>
					<Flex
						sx={{
							justifyContent: "space-between",
							alignItems: "center"
						}}>
						<Stack>
							<Heading size="md">{date.toFormat("d MMM yyyy")}</Heading>
							{transaction ? (
								<Text sx={{ color: "green.400" }}>
									Paid on {transaction.created_at.toFormat("d MMM yyyy")}
								</Text>
							) : (
								<Text
									sx={{
										color: DateTime.now() > date ? "red.400" : "yellow.400"
									}}>
									{DateTime.now() > date ? "Overdue by" : "Due in"}{" "}
									{Math.abs(
										date.diff(DateTime.now().startOf("day"), "days").days
									)}{" "}
									day(s)
								</Text>
							)}
						</Stack>
						<Button
							variant="outline"
							colorScheme="red"
							isDisabled={!!transaction}
							onClick={onOpen}>
							{transaction ? "Paid" : "Confirm"}
						</Button>
					</Flex>
				</CardBody>
			</Card>
			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader
							fontSize="lg"
							fontWeight="bold">
							Confirm Transaction
						</AlertDialogHeader>
						<AlertDialogBody>
							<Heading>Account</Heading>
							<Flex>
								{/* <Box
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
								</Text> */}
							</Flex>
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button
								ref={cancelRef}
								variant="ghost"
								colorScheme="red"
								onClick={onClose}>
								Cancel
							</Button>
							<Button
								colorScheme="red"
								onClick={handleConfirm}
								ml={3}>
								Confirm
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	)
}

export default TransactionItem
