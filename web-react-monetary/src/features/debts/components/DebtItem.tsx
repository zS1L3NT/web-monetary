import { DateTime } from "luxon"
import { useNavigate } from "react-router-dom"

import { Box, Card, CardBody, Flex, Skeleton, Text } from "@chakra-ui/react"

import { useGetAccountQuery } from "../../../api/accounts"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Debt from "../../../models/debt"

const DebtItem = ({ debt }: { debt: Debt }) => {
	const { token } = useOnlyAuthenticated()

	const navigate = useNavigate()

	const {
		data: account,
		error: accountError,
		isLoading: accountIsLoading
	} = useGetAccountQuery({
		token,
		account_id: debt.account_id
	})

	useToastError(accountError, true)

	return (
		<Card
			sx={{
				width: "full",
				my: 4,
				transition: "transform 0.3s",
				cursor: "pointer",
				":hover": {
					transform: "scale(1.01)"
				}
			}}
			onClick={() => navigate(debt.id)}>
			<CardBody>
				{accountIsLoading ? (
					<Skeleton sx={{ h: 54 }} />
				) : (
					<Flex sx={{ justifyContent: "space-between" }}>
						<Box>
							<Text
								sx={{
									fontSize: 18,
									fontWeight: 500
								}}>
								{debt.name}

								{debt.renderType()}
							</Text>

							{account?.renderAccount()}
						</Box>

						<Box
							sx={{
								width: "100px",
								mx: {
									base: 2,
									lg: 4
								}
							}}>
							{debt.renderAmount()}

							<Text
								sx={{
									textAlign: "right",
									color: DateTime.now() > debt.due_date ? "red.400" : "inherit",
									fontSize: 14,
									fontWeight: DateTime.now() > debt.due_date ? 600 : 400,
									opacity: 0.5
								}}>
								{debt.due_date.toFormat("d MMM yyyy")}
							</Text>
						</Box>
					</Flex>
				)}
			</CardBody>
		</Card>
	)
}

export default DebtItem
